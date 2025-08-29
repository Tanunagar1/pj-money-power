from rest_framework import serializers
from .models import LoanApplication,LoanEligibility,ContactMessage,CustomUser
from decimal import Decimal 
from .models import BlogPost,   CreditScore
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'phone_number', 'name']  # Add more fields if needed
class RegisterSerializer(serializers.Serializer):
    
    phone_number = serializers.CharField()
    name = serializers.CharField()
    def create(self, validated_data):
        user, created = CustomUser.objects.get_or_create(
            phone_number=validated_data['phone_number']
        )
        if created:
            user.name = validated_data['name']
            user.save()
        return user

class OTPVerifySerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    name = serializers.CharField()
    otp = serializers.CharField()




class LoanApplicationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # ✅ Include user details
    class Meta:
        model = LoanApplication
        fields = '__all__'
        read_only_fields = ['user', 'status', 'applied_at', 'name']

    def create(self, validated_data):
        # Assign user if present in validated_data or context
        user = validated_data.pop('user', None)
        if not user:
            request = self.context.get('request')
            if request and hasattr(request, 'user') and request.user.is_authenticated:
                user = request.user
        return LoanApplication.objects.create(user=user, **validated_data)



class LoanEligibilitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = LoanEligibility
        fields = '__all__'
        read_only_fields = ['eligibility_status', 'user', 'checked_at']

    def validate(self, data):
        income = data.get('monthly_income')
        expense = data.get('monthly_expense')

        if income is None or expense is None:
            raise serializers.ValidationError("Income and expense are required.")

        if expense > income:
            raise serializers.ValidationError("Expense cannot be more than income.")

        return data

    def _set_eligibility_status(self, validated_data):
        income = validated_data['monthly_income']
        expense = validated_data['monthly_expense']

        if expense > Decimal('0.7') * income:
            validated_data['eligibility_status'] = 'Not Eligible'
        else:
            validated_data['eligibility_status'] = 'Eligible'

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user

        self._set_eligibility_status(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        self._set_eligibility_status(validated_data)
        instance.eligibility_status = validated_data['eligibility_status']
        instance.save()
        return instance



class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ['created_at']


# blog 


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['title', 'summary', 'author', 'image', 'date']




class CreditScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditScore
        fields = '__all__'


from .models import CreditTransaction

class CreditTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTransaction
        fields = '__all__'
