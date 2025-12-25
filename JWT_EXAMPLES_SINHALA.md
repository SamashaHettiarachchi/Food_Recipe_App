# JWT Practical Examples - ප්‍රායෝගික උදාහරණ

## 🧪 ඔබේ Project එකේ JWT Testing

### 1️⃣ Browser Console එකේ Token Check කරන්නේ කොහොමද?

```javascript
// Browser එකේ F12 press කරලා Console tab එකට යන්න
// මේ commands ටයිප් කරන්න:

// 1. Current token එක බලන්න
const token = localStorage.getItem("token");
console.log("My Token:", token);

// 2. User data බලන්න
const user = JSON.parse(localStorage.getItem("user"));
console.log("My User Data:", user);

// 3. Token එක ඇද්ද නැද්ද check කරන්න
if (token) {
    console.log("✅ Token තියෙනවා - User login වෙලා");
} else {
    console.log("❌ Token නැහැ - User login වෙලා නැහැ");
}
```

### 2️⃣ Manual API Call Token සමඟ

```javascript
// Console එකේ මේක run කරලා token සමඟ API call එකක් කරන්න
const testAPI = async () => {
    const token = localStorage.getItem("token");
    
    try {
        const response = await fetch("https://foodrecipeapp-production.up.railway.app/api/recipe", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        
        const data = await response.json();
        console.log("API Response:", data);
    } catch (error) {
        console.log("Error:", error);
    }
};

// Function එක call කරන්න
testAPI();
```

## 🔄 Different Scenarios - විවිධ තත්වයන්

### Scenario 1: නව පරිශීලකයෙක් register වෙන්නේ

```
👤 User Action: Register form එකේ details fill කරනවා
                Name: "සමන්ත"
                Email: "samantha@gmail.com" 
                Password: "mypassword123"

📤 Frontend: POST /api/user/register
             {
               "name": "සමන්ත",
               "email": "samantha@gmail.com",
               "password": "mypassword123"
             }

🖥️ Backend: 1. Password hash කරනවා (bcrypt)
            2. User database එකේ save කරනවා
            3. JWT token හදනවා:
               jwt.sign({
                 userId: "new_user_id",
                 email: "samantha@gmail.com"
               }, JWT_SECRET, { expiresIn: "7d" })

📥 Response: {
              "message": "User registered successfully",
              "user": { "name": "සමන්ත", "email": "samantha@gmail.com" },
              "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }

💾 Frontend: localStorage.setItem("token", response.token)
            localStorage.setItem("user", JSON.stringify(response.user))
```

### Scenario 2: පරිශීලකයෙක් login වෙන්නේ

```
👤 User Action: Login form එකේ credentials දානවා
                Email: "samantha@gmail.com"
                Password: "mypassword123"

📤 Frontend: POST /api/user/login
             {
               "email": "samantha@gmail.com",
               "password": "mypassword123"
             }

🖥️ Backend: 1. Email එක database එකේ search කරනවා
            2. Password compare කරනවා (bcrypt.compare)
            3. Match නම් token හදනවා
            4. Match නැත්නම් error return කරනවා

📥 Success Response: {
                      "message": "Login successful",
                      "user": { "name": "සමන්ත", "email": "samantha@gmail.com" },
                      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    }

📥 Error Response: {
                    "message": "Invalid credentials"
                  }
```

### Scenario 3: නව Recipe එකක් add කරන්නේ

```
👤 User Action: Add Recipe form fill කරනවා
                Title: "කොත්තු රසකැවිලි"
                Description: "ඉක්මන් කොත්තු හදන විදිය"
                Image: food.jpg upload කරනවා

📤 Frontend: POST /api/recipe
             Headers: {
               "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
               "Content-Type": "multipart/form-data"
             }
             Body: FormData with recipe details + image

🛡️ Backend Middleware: verifyToken() function එක run වෙනවා
                       1. Token extract කරනවා header එකෙන්
                       2. jwt.verify() කරනවා
                       3. Valid නම් req.user = decoded data
                       4. Invalid නම් 401 error return කරනවා

🖥️ Backend Controller: addRecipe() function
                       1. Image Cloudinary එකට upload කරනවා
                       2. Recipe data + author (req.user.userId) save කරනවා
                       3. Success response return කරනවා

📥 Response: {
              "message": "Recipe added successfully",
              "recipe": {
                "title": "කොත්තු රසකැවිලි",
                "author": "සමන්ත",
                "coverImage": "https://cloudinary.com/..."
              }
            }
```

## 🚨 Error Handling - Error තත්වයන්

### Token නැති වෙලාවේ:

```javascript
// Frontend එකේ API call
fetch("/api/recipe", {
    method: "POST",
    // Authorization header නැහැ!
    body: JSON.stringify(recipeData)
})

// Backend response
{
    "status": 401,
    "message": "Token නැහැ, access deny!"
}

// Frontend handling
.catch(error => {
    if (error.status === 401) {
        showToast("error", "Login කරන්න ඕනේ!");
        // Login page එකට redirect කරනවා
        window.location.href = "/login";
    }
})
```

### Token expire වෙලා ඉන්න වෙලාවේ:

```javascript
// Backend verification
jwt.verify(token, JWT_SECRET) // throws error if expired

// Backend response
{
    "status": 401, 
    "message": "Token එක expire වෙලා!"
}

// Frontend handling
if (error.message.includes("expire")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showToast("warning", "Session එක expire වෙලා. Login කරන්න!");
}
```

## 🔧 Development Tips - Development කරන වෙලාවේ උපදෙස්

### 1. Token කාල සීමාව වෙනස් කරන්නේ:

```javascript
// Backend - controller/user.js එකේ
const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }  // 1 hour, "7d" = 7 days, "30m" = 30 minutes
);
```

### 2. Token Refresh System (Advanced):

```javascript
// Access token (short expiry) + Refresh token (long expiry)
const accessToken = jwt.sign({...}, SECRET, { expiresIn: "15m" });
const refreshToken = jwt.sign({...}, REFRESH_SECRET, { expiresIn: "7d" });

// Access token expire වෙලාම refresh token use කරලා නව access token හදනවා
```

### 3. Debug කරන්න console logs add කරන්න:

```javascript
// Backend middleware එකේ
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("🔍 Token received:", token ? "✅ Present" : "❌ Missing");
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("👤 User from token:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("❌ Token verification failed:", error.message);
        res.status(401).json({ message: "Token එක වැරදියි!" });
    }
};
```

## 📱 Mobile App වලට JWT භාවිතය

```javascript
// React Native වගේ mobile apps වලට
import AsyncStorage from '@react-native-async-storage/async-storage';

// Token store කරන්න
await AsyncStorage.setItem('token', response.token);

// Token read කරන්න  
const token = await AsyncStorage.getItem('token');

// API calls
fetch(url, {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
```

මේ විදියට ඔබේ Food Recipe App එකේ JWT system එක සම්පූර්ණයෙන්ම වැඩ කරනවා. User authentication, recipe management, favorites ඔක්කොම මේ token system එක මත based වෙලා තියෙනවා!