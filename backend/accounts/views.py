from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PlayerProfile
from .serializers import RegisterSerializer, PlayerProfileSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = PlayerProfile.objects.get_or_create(
            user=request.user
        )

        serializer = PlayerProfileSerializer(profile)

        return Response(serializer.data)

    def put(self, request):
        profile, created = PlayerProfile.objects.get_or_create(
            user=request.user
        )

        serializer = PlayerProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)