# otpapp/utils.py or views.py


from django.conf import settings
import requests


def send_otp_sms(to_number, otp, name):
    print(f"Sending OTP to {to_number} for {name}")

    url = "https://www.fast2sms.com/dev/bulkV2"
    payload = {
        'message': f'Hi {name} Wellcome to Pj Moneypower Your Registration OTP is : {otp}',
        'language': 'english',
        'route': 'q',
        'numbers': to_number
    }
    headers = {
        'authorization': settings.FAST_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(url, data=payload, headers=headers)
    print(response.json())
