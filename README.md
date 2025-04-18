## Overview

The Document Signer & Annotation Tool is a modern web application built with Next.js that allows users to upload, annotate, and export PDF documents seamlessly. Designed with a sleek and intuitive interface, this tool empowers users to highlight, underline, comment, and sign documents with ease. Whether you're reviewing contracts, collaborating on reports, or signing important files, this application provides all the tools you need in one place.

### Key Features:
- **PDF Upload**: Drag-and-drop or select files to upload and view PDFs instantly.
- **Annotation Tools**: Highlight, underline, comment, and draw signatures directly on the document.
- **Export Functionality**: Save annotated PDFs with all changes embedded while maintaining high quality.
- **Responsive Design**: Optimized for use across devices, from desktops to mobile screens.
- **Smooth User Experience**: Fast, single-page application with real-time updates and feedback.

Built with cutting-edge technologies like React, Tailwind CSS, and pdf-lib, this project demonstrates the power of modern web development to create efficient and user-friendly tools.

## Setup Instructions

1. **Clone the repository**  
   ```bash
   https://github.com/Peazzycole/frontend-test-riteaseApp.git
   ```
2.  - cd your-repo
3. ```bash
      #run
      npm install
      #or run
      yarn install
   ```
4. After installation run
   ```bash
      npm run dev
      #or
      yarn dev
   ```
   The app should now be running at http://localhost:3000

## Tools Used
1. **Framer Motion:** I Used this for animations and transitions, such as sidebar animations and notification popups.

2. **lucide-react**: This Provides SVG-based icons used in the UI, such as file upload and alert icons.

3. **pdf-lib**: I Used this library for manipulating the PDF file, such as embedding annotations and exporting the annotated PDF.

4. **react-dropzone**: I Used this for implementing drag-and-drop functionality and also for uploading PDF files.

5. **react-icons**: This library Provides a collection of icons used in the UI, such as annotation and tool icons.

6. **react-pdf**: This I Used for rendering PDF documents in the browser.

7. **uuid**: Used this to generate unique IDs for annotations.
