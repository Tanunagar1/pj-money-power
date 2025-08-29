import random
import requests
from django.http import JsonResponse
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import BlogPost, CustomUser, OTP, LoanApplication, LoanEligibility, ContactMessage
from .serializers import BlogPostSerializer, RegisterSerializer, OTPVerifySerializer, LoanEligibilitySerializer, LoanApplicationSerializer, ContactMessageSerializer
from .utils import send_otp_sms  # or from same file
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken

# Function-based view for credit/download/ endpoint
@api_view(["POST"])
def download_report(request):
    """
    Downloads the credit score report from Deepvue API.
    Expects: {"transaction_id": "..."}
    Returns: report data
    """
    transaction_id = request.data.get("transaction_id")
    if not transaction_id:
        return Response({"error": "transaction_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        token = get_access_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
        }
        url = f"{REPORT_URL}?transaction_id={transaction_id}"
        res = requests.get(url, headers=headers).json()
        return Response(res)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
import random
import requests
from django.http import JsonResponse
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework import viewsets
from .models import BlogPost
from .serializers import BlogPostSerializer

from .models import CustomUser, OTP, LoanApplication, LoanEligibility,ContactMessage

from .serializers import RegisterSerializer, OTPVerifySerializer,LoanEligibilitySerializer,LoanApplicationSerializer,ContactMessageSerializer

from .utils import send_otp_sms  # or from same file
import random
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(APIView):
    def get(self, request):
        phone = request.query_params.get('phone_number')
        if not phone:
            return Response({'error': 'phone_number query param required'}, status=400)
        if not phone.startswith('+'):
            phone = '+91' + phone
        try:
            user = CustomUser.objects.get(phone_number=phone)
            return Response({
                'name': user.name,
                'phone_number': user.phone_number,
                'is_verified': user.is_verified
            }, status=200)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        phone = serializer.validated_data['phone_number']
        input_name = serializer.validated_data['name']

        # ✅ Create OTP (dummy for testing)
        otp = random.randint(100000, 999999)
        print(f"Generated OTP: {otp}")

        try:
            user_exists = CustomUser.objects.filter(phone_number=phone).exists()

            if user_exists:
                user = CustomUser.objects.get(phone_number=phone)
                name_to_save = user.name
            else:
                user = serializer.save()  # Save new user and get instance
                name_to_save = user.name
                user_exists = True  # ✅ Mark as True for new user too

            # Save OTP
            OTP.objects.create(phone_number=phone, otp_code=otp, name=name_to_save)

            try:
                send_otp_sms(phone, otp, name_to_save)
            except Exception as send_otp_error:
                return Response({
                    "error": "Failed to send OTP",
                    "details": str(send_otp_error)
                }, status=500)

            # If already registered, send loan data if exists
            loan = LoanApplication.objects.filter(user=user).last()
            print(loan,user.name)
            if loan:
                from .serializers import LoanApplicationSerializer
                loan_data = LoanApplicationSerializer(loan).data
                return Response({
                    "message": "OTP sent successfully",
                    "already_registered": True,
                    "loan_data": loan_data,
                    "otp": otp
                })

            return Response({
                "message": "OTP sent successfully",
                "already_registered": user_exists,
                "otp": otp
            })

        except Exception as e:
            return Response({
                "error": "Unexpected error occurred",
                "details": str(e)
            }, status=500)











class OTPVerifyView(APIView):
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone_number']
            otp = serializer.validated_data['otp']
            name = serializer.validated_data['name']

            

            # Validate OTP
            otp_qs = OTP.objects.filter(phone_number=phone, otp_code=otp).order_by('-created_at')
            if not otp_qs.exists():
                return Response({'verified': False, 'message': 'Invalid OTP or phone number.'}, status=HTTP_400_BAD_REQUEST)
            otp_obj = otp_qs.first()
            # Optional: check expiry (e.g., valid for 10 minutes)
            from datetime import timedelta, timezone, datetime
            expiry_minutes = 10
            now = datetime.now(timezone.utc)
            if hasattr(otp_obj, 'created_at'):
                if (now - otp_obj.created_at) > timedelta(minutes=expiry_minutes):
                    return Response({'verified': False, 'message': 'OTP expired. Please request a new one.'}, status=HTTP_400_BAD_REQUEST)

            # Create or get user, only set name if newly created
            user, created = CustomUser.objects.get_or_create(phone_number=phone)
            if created and name:
                user.name = name
            user.is_verified = True
            user.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'verified': True,
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
            }, status=HTTP_200_OK)

        # If serializer is invalid, return errors
        return Response({'verified': False, 'message': 'Invalid input', 'details': serializer.errors}, status=HTTP_400_BAD_REQUEST)




class LoanApplicationView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser,MultiPartParser, FormParser]

    def get(self, request):
        applications = LoanApplication.objects.all()
        serializer = LoanApplicationSerializer(applications, many=True)
        return Response({'success': True, 'data': serializer.data})

    def post(self, request):
        permission_classes = [AllowAny]
        phone = request.data.get('phone_number')
        user = None
        if phone:
            if not str(phone).startswith('+'):
                phone = '+91' + str(phone)
            from .models import CustomUser
            user, _ = CustomUser.objects.get_or_create(phone_number=phone)
        elif request.user and request.user.is_authenticated:
            user = request.user
            print(user.name)

        # Use request.data and request.FILES directly
        data = request.data
        # Only set l_name if not present and user has a name
        if user and hasattr(user, 'name') and user.name and not data.get('l_name'):
            # DRF QueryDict is mutable only after .copy(), but we avoid copying file objects
            mutable_data = data.copy()
            mutable_data['l_name'] = user.name
            data = mutable_data
        elif 'name' in data:
            mutable_data = data.copy()
            del mutable_data['name']
            data = mutable_data

        serializer = LoanApplicationSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=user)
            print('data save')
            return Response({'success': True, 'message': 'Loan application submitted'})
        return Response(serializer.errors, status=400)

    # ✅ PATCH method to update loan status
    def patch(self, request, *args, **kwargs):
        from .models import LoanApplication
        loan_id = request.data.get('id')
        new_status = request.data.get('status')

        if not loan_id or not new_status:
            return Response({'success': False, 'message': 'Loan ID and status are required'}, status=400)

        try:
            loan = LoanApplication.objects.get(id=loan_id)
        except LoanApplication.DoesNotExist:
            return Response({'success': False, 'message': 'Loan not found'}, status=404)

        loan.status = new_status
        loan.save()
        return Response({'success': True, 'message': 'Loan status updated successfully'})

class LoanEligibilityView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        loans = LoanEligibility.objects.all().order_by('-checked_at')
        serializer = LoanEligibilitySerializer(loans, many=True)
        return Response({'success': True, 'data': serializer.data})

    def post(self, request):
        data = request.data.copy()

        # Auto-fill full_name if user has 'name' field
        if request.user.is_authenticated and hasattr(request.user, 'name'):
            data['full_name'] = request.user.name

        serializer = LoanEligibilitySerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()  # ✅ user & eligibility handled inside serializer
            return Response({'success': True, 'data': serializer.data})
        return Response({'success': False, 'errors': serializer.errors}, status=400)

class ContactMessageAPIView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Message sent successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        messages = ContactMessage.objects.all().order_by('-created_at')
        serializer = ContactMessageSerializer(messages, many=True)
        return Response({'success': True, 'data': serializer.data})


class count_view(APIView):

    def get(self, request):
        users = CustomUser.objects.all()
        total_users = users.count()
        serializer = RegisterSerializer(users, many=True)
        # login_users: only users who are verified (or add your own filter logic)
        login_users = users.filter(is_verified=True)
        login_serializer = RegisterSerializer(login_users, many=True)
        return Response({
            "total_users": total_users,
            "login_users": login_serializer.data,
            "all_users": serializer.data,
            "deploy": "deployed at 13.08.2025",
        })

# blog

class BlogPostListCreateView(APIView):
    parser_classes = [JSONParser,MultiPartParser, FormParser]
    def get(self, request):
        posts = BlogPost.objects.all().order_by('-created_at')
        serializer = BlogPostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = BlogPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# credit score

BASE_URL = "https://production.deepvue.tech/v2/financial-services/credit-bureau/equifax/credit-report/sdk"

@api_view(["POST"])
def initiate_session(request):
    """
    Initiates a session with Deepvue v2 API for credit score checking.
    Expects: {"full_name": "...", "mobile_number": "..."}
    Returns: session_id, status, message
    """
    from .models import CreditScore, CustomUser
    from .serializers import CreditScoreSerializer
    data = request.data
    full_name = data.get("full_name")
    mobile_number = data.get("mobile_number")
    pan_number = data.get("pan_number")
    if not (full_name and mobile_number and pan_number):
        return Response({"error": "Missing required fields."}, status=400)
    # Store details in CreditScore
    user = None
    try:
        user = CustomUser.objects.get(phone_number=mobile_number)
    except CustomUser.DoesNotExist:
        user = None
    credit_score_obj, created = CreditScore.objects.get_or_create(
        user=user,
        defaults={"full_name": full_name, "mobile_number": mobile_number, "pan_number": pan_number}
    )
    if not created:
        credit_score_obj.full_name = full_name
        credit_score_obj.mobile_number = mobile_number
        credit_score_obj.pan_number = pan_number
        credit_score_obj.save()
    # Call Deepvue API
    url = "https://production.deepvue.tech/v2/financial-services/credit-bureau/equifax/credit-report/sdk/session"
    payload = {
        "redirect_uri": "",
        "full_name": full_name,
        "mobile_number": mobile_number,
        "pan_number": pan_number,
        "enrich": True
    }
    headers = {
        "Authorization": f"Bearer {settings.DEEPVUE_BEARER_TOKEN}",
        "x-api-key": f"{settings.DEEPVUE_API_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.post(url, json=payload, headers=headers)
    resp_json = response.json()
    redirect_url = resp_json.get("data", {}).get("redirect_url")
    return Response({
        "transaction_id": resp_json.get("transaction_id"),
        "redirect_url": redirect_url,
        "credit_score": CreditScoreSerializer(credit_score_obj).data,
        "api_response": resp_json
    })

import os
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

API_KEY = settings.API_KEY
REPORT_URL = settings.REPORT_URL
AUTH_URL = settings.AUTH_URL
CLIENT_ID = settings.CLIENT_ID 
CLIENT_SECRET = settings.CLIENT_SECRET
REDIRECT_URI = settings.DEFAULT_REDIRECT_URI
SESSION_URL = settings.SESSION_URL

def get_access_token():
    res = requests.post(AUTH_URL, data={"client_id": CLIENT_ID, "client_secret": CLIENT_SECRET})
    try:
        j = res.json()
    except Exception:
        raise Exception(f"Auth Failed: non-JSON response (status {res.status_code})")
    token = j.get("access_token")
    if not token:
        raise Exception(f"Auth Failed: {j}")
    return token

class CreateSDKSessionView(APIView):
    """
    POST: { "full_name": "Name", "mobile_number": "1234567890", "pan_number": "ABCDE1234F" (optional) }
    """
    def post(self, request):
        full_name = request.data.get("full_name")
        mobile_number = request.data.get("mobile_number")
        pan_number = request.data.get("pan_number")  # optional; include if required
        if not full_name or not mobile_number:
            return Response({"message": "full_name and mobile_number are required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = get_access_token()
            headers = {
                "Authorization": f"Bearer {token}",
                "x-api-key": API_KEY,
                "Content-Type": "application/json",
            }
            payload = {
                "redirect_uri": REDIRECT_URI,
                "full_name": full_name,
                "mobile_number": mobile_number,
                "enrich": True,
            }
            if pan_number:
                payload["pan_number"] = pan_number

            r = requests.post(SESSION_URL, headers=headers, json=payload)
            data = r.json()
            if r.status_code != 201 or "data" not in data or "redirect_url" not in data["data"]:
                return Response({"message": "Failed to create SDK session", "details": data}, status=status.HTTP_502_BAD_GATEWAY)
            return Response({
                "transaction_id": data.get("transaction_id"),
                "redirect_url": data["data"]["redirect_url"],
                "c_token": token
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FetchCreditReportView(APIView):
    """
    POST: { "transaction_id": "TRANSACTION_ID" }
    """
    def post(self, request):
        transaction_id = request.data.get("transaction_id")
        if not transaction_id:
            return Response({"error": "transaction_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            token = get_access_token()
            headers = {
                "Authorization": f"Bearer {token}",
                "x-api-key": API_KEY,
                "Content-Type": "application/json"
            }
            url = f"{REPORT_URL}?transaction_id={transaction_id}"
            res = requests.get(url, headers=headers).json()
            return Response(res)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
