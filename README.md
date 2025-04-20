# 🍕 Papa John's Website Clone

A fully responsive website clone of **Papa John's** built using **HTML5**, **CSS3**, **JavaScript**, and **Bootstrap 5**. This project mimics the look and feel of the official Papa John's website and includes dynamic menu rendering, a shopping cart, and category filtering—all powered by a GitHub-hosted JSON API.

---

## 🚀 Features

- ✅ Responsive design for all screen sizes  
- 🔍 Search functionality for menu items  
- 🛒 Shopping cart with local storage support  
- 📁 Dynamic menu loading from GitHub-hosted JSON  
- 📂 Category-based menu filtering  
- ⏳ Loading states and error handling  
- 🧠 Local storage caching for better performance  

---

## 📁 Project Structure

```
papa-johns/
├── index.html
├── menu.html 
├── about.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── menu.js
│   ├── cart.js
│   └── contact.js
├── images/
```

---

## 🔧 Project Setup

### 1. Create JSON Data File

Create a file named `papa-johns-menu-en-expanded.json` containing structured menu data:

```json
{
  "restaurant": "Papa John's",
  "categories": [
    {
      "name": "Pizzas",
      "items": [
        {
          "id": 1,
          "name": "Pepperoni Pizza", 
          "description": "Classic pizza topped with pepperoni & mozzarella cheese",
          "price": 623.52,
          "currency": "EGP",
          "image": "path/to/image"
        }
        //  more menu items here...
      ]
    }
    //  more categories here...
  ]
}
```

---

### 2. Host the JSON File on GitHub

1. Create a new repository on GitHub (e.g., `papa-johns-api`)
2. Upload the JSON file to the repository
3. Get the **raw URL** of the JSON file:
   - Click on the file in the repository
   - Click the "Raw" button
   - Copy the URL (e.g.,  
     https://raw.githubusercontent.com/jawadTamer/papa-johns-api/main/papa-johns-menu-en-expanded.json)

---

### 3. Load the Menu Data

In `menu.js`, use `fetch()` to load the menu from the raw GitHub URL and dynamically populate the UI with the data.

```javascript
fetch('https://raw.githubusercontent.com/...')
  .then(response => response.json())
  .then(data => {
    // render categories and items
  })
  .catch(error => {
    // handle errors
  });
```

---

## 💻 Usage

1. Clone the repository  
2. Open `index.html` in your browser  
3. Navigate through the website (Menu, About, Contact)  
4. Test cart, filtering, and search functionalities  

---

## 🌐 Live Demo

Check out the live version of the project on GitHub Pages:  
🔗 [https://jawadtamer.github.io/Tsak4/](https://jawadtamer.github.io/Tsak4/)

---

## 🛠️ Technologies Used

- HTML5  
- CSS3  
- JavaScript (ES6)  
- Bootstrap 5  
- SweetAlert (for enhanced alerts)  
- AOS (Animate On Scroll library)  
- GitHub API (for menu data)  

---

## 📌 Notes

- Menu data is dynamically fetched from a GitHub-hosted JSON file  
- Menu item images can be stored as base64 strings inside the JSON (demo purposes only)  
- Caching is handled via local storage to improve performance  
- The website is fully responsive and mobile-friendly  

---
