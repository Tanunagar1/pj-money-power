from django.urls import path
from .views import RegisterView, OTPVerifyView,LoanApplicationView,LoanEligibilityView,ContactMessageAPIView,count_view,BlogPostListCreateView,CreateSDKSessionView, FetchCreditReportView
from rest_framework_simplejwt.views import TokenRefreshView
from . import views



# urls.py






urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('verify/', OTPVerifyView.as_view(), name='verify'),
    path('loan-apply/', LoanApplicationView.as_view(), name='loan-apply'),
    path('loan-apply/<int:pk>/', LoanApplicationView.as_view(), name='loan-apply-detail'),
    path('loan-eligibility/', LoanEligibilityView.as_view(), name='loan-eligibility'),
    path('contact/', ContactMessageAPIView.as_view(), name='contact-message'),
    path('all_counts/', count_view.as_view(), name='contact-message'),
    path('support-messages/', ContactMessageAPIView.as_view(), name='support-messages'),
    path("blogs/", BlogPostListCreateView.as_view(), name="blogs"),
    path("credit/initiate/", views.initiate_session, name="initiate_session"),
    path("credit/download/", views.download_report, name="download_report"),
    path("sdk-session/", CreateSDKSessionView.as_view(), name="sdk-session"),  
    path("credit-report/", FetchCreditReportView.as_view(), name="credit-report"),
]
