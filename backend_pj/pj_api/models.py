from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(self, phone_number):
        user = self.model(phone_number=phone_number)
        user.save()
        return user

class CustomUser(AbstractBaseUser):
    phone_number = models.CharField(max_length=15, unique=True)
    name = models.CharField(max_length=100, null=True, blank=True)  # ✅ Add this
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

class OTP(models.Model):
    phone_number = models.CharField(max_length=15)
    name = models.CharField(max_length=100, null=True, blank=True) 
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)



class LoanApplication(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    l_name = models.CharField(max_length=100)
    email = models.EmailField()
    loan_amount = models.DecimalField(max_digits=100, decimal_places=2)
    loan_type = models.CharField(max_length=200,null=True)
    location = models.CharField(max_length=100)

    aadhaar_photo = models.ImageField(upload_to='ADHAR_CARD/',null=True)
    pan_photo = models.ImageField(upload_to='PAN_CARD/',null=True)
    bank_passbook_photo = models.ImageField(upload_to='BANK_PASSBOOK/',null=True)
    profile_photo = models.ImageField(upload_to='USER_PHOTO/',null=True)

    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='Pending')
class LoanEligibility(models.Model):
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,  # Allow null
        blank=True  # Allow blank
    )
    full_name = models.CharField(max_length=100)
    monthly_income = models.DecimalField(max_digits=10, decimal_places=2)
    monthly_expense = models.DecimalField(max_digits=10, decimal_places=2)
    work_type = models.CharField(max_length=50)
    eligibility_status = models.CharField(max_length=20)  # 'Eligible' or 'Not Eligible'
    checked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.eligibility_status}"




class ContactMessage(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.full_name}"

# blog 


class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    summary = models.TextField()
    author = models.CharField(max_length=100)
    image = models.ImageField(upload_to="blog_images/", blank=True, null=True)
    date = models.DateField(auto_now_add=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class CreditScore(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255, default="Unknown", blank=True)
    mobile_number = models.CharField(max_length=15)
    pan_number = models.CharField(max_length=20)

    def __str__(self):
        return self.full_name


class CreditBalence(models.Model):
    total_credit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    available_credit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_used_credit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    used_credit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class CreditTransaction(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="credit_transactions")
    transaction_id = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=20)
    redirect_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    credit_score = models.CharField(max_length=10, blank=True, null=True)
    credit_data = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"{self.full_name} - {self.transaction_id}"

