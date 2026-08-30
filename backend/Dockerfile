# Build stage for .NET 9 API
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy solution and project files first for efficient caching
COPY backend/SoftCare.Backend.sln ./backend/
COPY backend/src/SoftCare.Domain/*.csproj ./backend/src/SoftCare.Domain/
COPY backend/src/SoftCare.Application/*.csproj ./backend/src/SoftCare.Application/
COPY backend/src/SoftCare.Infrastructure/*.csproj ./backend/src/SoftCare.Infrastructure/
COPY backend/src/SoftCare.API/*.csproj ./backend/src/SoftCare.API/

# Restore dependencies
RUN dotnet restore backend/SoftCare.Backend.sln

# Copy all source code
COPY backend/ ./backend/

# Publish release build
WORKDIR /app/backend/src/SoftCare.API
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 5000

ENTRYPOINT ["dotnet", "SoftCare.API.dll"]
