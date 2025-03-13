from django.shortcuts import render, get_object_or_404, redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
from .models import ShortenedURL

API_KEY = "2cee603cb02d328db57c839649f2aa7021a3ca422bec84cb647b934a4af32a64"  # Your VirusTotal API Key
VIRUSTOTAL_URL = "https://www.virustotal.com/api/v3/urls"

@api_view(['POST'])
def shorten_url(request):
    original_url = request.data.get('url')
    
    # Scan URL using VirusTotal
    headers = {"x-apikey": API_KEY}
    data = {"url": original_url}
    response = requests.post(VIRUSTOTAL_URL, headers=headers, data=data)
    scan_result = response.json()
    
    # Check if URL is flagged as malicious
    if scan_result.get('data', {}).get('attributes', {}).get('last_analysis_stats', {}).get('malicious', 0) > 0:
        return Response({"error": "This URL is flagged as malicious"}, status=400)

    # Create short URL
    short_url = ShortenedURL.objects.create(original_url=original_url)
    return Response({"short_url": f"http://localhost:8000/{short_url.short_code}"})

@api_view(['GET'])
def redirect_url(request, short_code):
    url_entry = get_object_or_404(ShortenedURL, short_code=short_code)
    return redirect(url_entry.original_url)
