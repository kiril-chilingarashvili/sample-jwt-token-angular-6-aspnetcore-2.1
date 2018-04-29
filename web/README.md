# Sample - Authentication using JWT token and resource owner flow using Angular-6 and ASP.NET Core-2.1

- open and run "api" using Visual Studio 2017 (or command line dotnet run)
- run frontend by opening "web" and running npm i && npm start
- navigate to http://localhost:5555
- use username: Kirill password: 123

## Some highlights

- This solution uses "RefactorxApiService" as single point for accessing server API, it:
-- Injects bearer token to each request
-- Transparently handles 401 with expired tokens to refresh token and retry request. (To test this, once logged in - open browser developer tools to observe network traffic, click "request" button every 5 seconds, - eventually the token will expire (20 seconds) and new token will be transparently refreshed and request will be re-run).
- The solutions has "RefactorxPermissionGuard" - assign it to routes, and use permission:
-- ? - allow only anonymous users
-- ! - allow only authenticated users
-- * allow any user
- Assign "RefactorxRedirectComponent" to route and array of permission/target pairs, once the route is hit, all pairs will be checked sequentially, target for first passing permission will be used as navigation redirect target
- Use [refactorxPermission] directive to show hide elements by checking permission, example: [refactorxPermission]="!"
- RefactorxApiService counts all request/response statuses, and provides "loading" event when there is at least one currently executing requests

## Generating private key on the server

- Generate private key. Used some password.
-- openssl genrsa -des3 -out private.pem 2048
- Get private key in PEM format
-- openssl rsa -in private.pem -out private_unencrypted.pem -outform PEM
- read the key 
-- cat private_unencrypted.pem
- paste it to SigningKey.cs
