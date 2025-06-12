# 👁️ Thirdeye03: Royalty-Free Image Platform

Thirdeye03 is a modern, full-stack web application designed to provide users with a seamless experience for finding and downloading high-quality, royalty-free images. This platform combines a dynamic **React.js** frontend with a robust **Spring Boot** backend, utilizing **Cloudinary** for efficient image storage and delivery, and **Firebase Firestore** for flexible data management. Secure authentication and authorization are handled via **JWT Tokens**, ensuring a safe environment for users.

## ✨ Key Features

* **Extensive Image Library:** Browse and discover a wide collection of royalty-free images.

* **User Authentication:** Secure user registration and login powered by JWT for token-based authentication.

* **Image Upload & Management:** Users can upload their own images, managed efficiently by Cloudinary.

* **Search & Filtering:** Powerful search capabilities to quickly find images by keywords or categories.

* **High-Performance Image Delivery:** Leveraging Cloudinary CDN for fast and optimized image loading.

* **Real-time Data Storage:** Firebase Firestore provides a NoSQL database for flexible data persistence and real-time updates.

* **Responsive User Interface:** Built with React.js and custom CSS for an intuitive and mobile-friendly experience.

* **Robust RESTful API:** A Spring Boot backend provides well-structured REST endpoints for all data operations.

## 🚀 Technologies & Tools

* **Frontend:**

  * **React.js:** A JavaScript library for building user interfaces.

  * **CSS:** For styling and responsive design.

  * **Firebase Firestore:** NoSQL cloud database for flexible data storage.

* **Backend:**

  * **Spring Boot:** Framework for building the backend application.

  * **Spring JPA:** For database interaction (with a relational database, though Firestore is also used for specific data).

  * **REST API:** Standard for communication between frontend and backend.

  * **JWT (JSON Web Tokens):** For secure user authentication and authorization.

* **Cloud Services:**

  * **Cloudinary:** Cloud-based image and video management solution for storing, optimizing, and delivering media.

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* **Node.js & npm (or Yarn):** For running the React.js frontend.

* **Java Development Kit (JDK) 11 or higher:** For the Spring Boot backend.

* **Maven (or Gradle):** For building the Spring Boot project.

* **Firebase Project:** A Firebase project configured with Firestore.

* **Cloudinary Account:** A Cloudinary account with API credentials.

* **An IDE:** Such as VS Code, IntelliJ IDEA, or Eclipse.

### Installation and Running

#### 1. Backend Setup

1. **Clone the repository:**


git clone https://github.com/GhateSwarada/Thirdeye03.git


2. **Navigate to the backend directory:**


cd Thirdeye03/backend # Assuming backend is in a 'backend' folder


3. **Build the project:**


mvn clean install


4. **Run the Spring Boot application:**


mvn spring-boot:run


The backend will typically start on `http://localhost:8080`.

#### 2. Frontend Setup

1. **Navigate to the frontend directory:**


cd Thirdeye03/frontend # Assuming frontend is in a 'frontend' folder


2. **Install dependencies:**


npm install

or yarn install

3. **Start the React development server:**


npm start

or yarn start

The frontend will typically open in your browser at `http://localhost:3000`.

## 🖥️ Usage

1. Open your web browser and navigate to `http://localhost:3000`.

2. Register a new user account or log in if you already have one.

3. Browse the collection of royalty-free images.

4. Upload your own images (if enabled for users).

5. Search for specific images using the search bar.

