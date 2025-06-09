import os

url_to_redirect_to = os.getenv("PROXY_BASE_URL", "")
url_to_redirect_to += "/login"
html_form = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>LiteLLM Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: #333;
        }}

        form {{
            background-color: #fff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            width: 450px;
            max-width: 100%;
        }}
        
        .logo-container {{
            text-align: center;
            margin-bottom: 30px;
        }}
        
        .logo {{
            font-size: 24px;
            font-weight: 600;
            color: #1e293b;
        }}
        
        h2 {{
            margin: 0 0 10px;
            color: #1e293b;
            font-size: 28px;
            font-weight: 600;
            text-align: center;
        }}
        
        .subtitle {{
            color: #64748b;
            margin: 0 0 20px;
            font-size: 16px;
            text-align: center;
        }}

        .info-box {{
            background-color: #f1f5f9;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 30px;
            border-left: 4px solid #2563eb;
        }}
        
        .info-header {{
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            color: #1e40af;
            font-weight: 600;
            font-size: 16px;
        }}
        
        .info-header svg {{
            margin-right: 8px;
        }}
        
        .info-box p {{
            color: #475569;
            margin: 8px 0;
            line-height: 1.5;
            font-size: 14px;
        }}

        label {{
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #334155;
            font-size: 14px;
        }}
        
        .required {{
            color: #dc2626;
            margin-left: 2px;
        }}

        input[type="text"],
        input[type="password"] {{
            width: 100%;
            padding: 10px 14px;
            margin-bottom: 20px;
            box-sizing: border-box;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 15px;
            color: #1e293b;
            background-color: #fff;
            transition: border-color 0.2s, box-shadow 0.2s;
        }}
        
        input[type="text"]:focus,
        input[type="password"]:focus {{
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }}

        .toggle-password {{
            display: flex;
            align-items: center;
            margin-top: -15px;
            margin-bottom: 20px;
        }}
        
        .toggle-password input {{
            margin-right: 6px;
        }}

        input[type="submit"] {{
            background-color: #6466E9;
            color: #fff;
            cursor: pointer;
            font-weight: 500;
            border: none;
            padding: 10px 16px;
            transition: background-color 0.2s;
            border-radius: 6px;
            margin-top: 10px;
            font-size: 14px;
            width: 100%;
        }}

        input[type="submit"]:hover {{
            background-color: #4138C2;
        }}

        .divider {{
            text-align: center;
            margin: 30px 0 20px 0;
            position: relative;
            color: #64748b;
            font-size: 14px;
        }}
        
        .divider::before {{
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background-color: #e2e8f0;
            z-index: 1;
        }}
        
        .divider span {{
            background-color: #fff;
            padding: 0 15px;
            position: relative;
            z-index: 2;
        }}
        
        .sso-button {{
            background-color: #fff;
            color: #334155;
            border: 1px solid #e2e8f0;
            cursor: pointer;
            font-weight: 500;
            padding: 10px 16px;
            transition: all 0.2s;
            border-radius: 6px;
            font-size: 14px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            box-sizing: border-box;
        }}
        .sso-button:hover {{
            background-color: #f8fafc;
            border-color: #cbd5e1;
            text-decoration: none;
        }}
        
        .sso-button svg {{
            margin-right: 8px;
            flex-shrink: 0;
        }}
        
        .sso-button-content {{
            display: flex;
            align-items: center;
            justify-content: center;
        }}
        
        a {{
            color: #3b82f6;
            text-decoration: none;
        }}

        a:hover {{
            text-decoration: underline;
        }}
        
        code {{
            background-color: #f1f5f9;
            padding: 2px 4px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 13px;
            color: #334155;
        }}
        
        .help-text {{
            color: #64748b;
            font-size: 14px;
            margin-top: -12px;
            margin-bottom: 20px;
        }}
    </style>
</head>
<body>
    <form action="{url_to_redirect_to}" method="post">
        <div class="logo-container">
            <div class="logo">
                🚅 LiteLLM
            </div>
        </div>
        <h2>Login</h2>
        <p class="subtitle">Access your LiteLLM Admin UI.</p>
        <div class="info-box">
            <div class="info-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Default Credentials
            </div>
            <p>By default, Username is <code>admin</code> and Password is your set LiteLLM Proxy <code>MASTER_KEY</code>.</p>
            <p>Need to set UI credentials or SSO? <a href="https://docs.litellm.ai/docs/proxy/ui" target="_blank">Check the documentation</a>.</p>
        </div>
        <label for="username">Username<span class="required">*</span></label>
        <input type="text" id="username" name="username" required placeholder="Enter your username" autocomplete="username">
        
        <label for="password">Password<span class="required">*</span></label>
        <input type="password" id="password" name="password" required placeholder="Enter your password" autocomplete="current-password">
        <div class="toggle-password">
            <input type="checkbox" id="show-password" onclick="togglePasswordVisibility()">
            <label for="show-password">Show password</label>
        </div>
        <input type="submit" value="Login">
        <div class="divider">
            <span>or</span>
        </div>
        
        <a href="{url_to_redirect_to.replace('/login', '/sso/key/generate')}" class="sso-button">
            <div class="sso-button-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
            </div>
        </a>
    </form>
    <script>
        function togglePasswordVisibility() {{
            var passwordField = document.getElementById("password");
            passwordField.type = passwordField.type === "password" ? "text" : "password";
        }}
    </script>
</body>
</html>
"""
