FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY CoPuree.slnx ./
COPY CoPuree.Web/CoPuree.Web.csproj CoPuree.Web/
RUN dotnet restore CoPuree.slnx

COPY . .
RUN dotnet publish CoPuree.Web/CoPuree.Web.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

RUN mkdir -p /app/data
COPY --from=build /app/publish .

CMD ["sh", "-c", "dotnet CoPuree.Web.dll --urls http://0.0.0.0:${PORT:-8080}"]
