# Des2Ract – Figma to React Code Generator

Des2Ract is an AI-powered tool that converts your Figma designs into production-ready React components. This guide provides a step-by-step tutorial to help you generate code from your designs.

---

## 📌 Getting Started with Your Figma File

| Step                           | Instruction                                                                                                                                                                                      | Example                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| **1. Prepare Your Design**     | - Set your Figma project to **public**.<br>- Only **one page** is supported.<br>- Enclose your design in a **single frame** (page node).<br>- Page node must not be inside or below other nodes. | <img width="776" height="607" alt="image" src="https://github.com/user-attachments/assets/1bc5f9fd-36b1-4610-89a6-0e847b17e896" /> <br> <img width="781" height="584" alt="image" src="https://github.com/user-attachments/assets/1292d2a5-7d19-436b-a8fa-625ea376ff9c" /> |
| **2. Copy the Page Node Link** | Select the **page node** in your Figma file, right-click, and copy its URL.                                                                                                                      | <img width="1380" height="725" alt="image" src="https://github.com/user-attachments/assets/c927e40c-1458-4564-bc6f-e6d948150948" /> |

---

## 🚀 Using the Des2Ract Application

| Step                           | Instruction                                                                                                                                                                                           | Example                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **3. Open the Dashboard**      | Launch the app and click **New Project**.                                                                                                                                                             | <img width="1158" height="683" alt="image" src="https://github.com/user-attachments/assets/2959fffc-4006-41a1-8f7e-d67eafbcaf3e" /> |
| **4. Paste Your Figma URL**    | Paste the copied URL. Your design should appear in the preview.<br>If it doesn’t, return to step 1 and re-check setup.<br>Click the rightmost button to continue.                                     | <img width="1380" height="725" alt="image" src="https://github.com/user-attachments/assets/49939ed7-8fa0-407e-8076-dd6073bc5fc9" /> |
| **5. Handle Redundant Groups** | Review the list of visually redundant nodes.<br>- Select elements you want to preserve (a faded box will highlight them).<br>- Use the search bar to quickly find nodes.<br>- Continue when finished. | <img width="1376" height="723" alt="image" src="https://github.com/user-attachments/assets/9491b37f-5603-4e05-a6c1-aa104fb13853" /> |

---

## 🏗️ Refining Your Layout

| Step                                | Instruction                                                                                                                                     | Example                                                                                    |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **6. Preview Layout Structure**     | Review the inferred hierarchy of your design.<br>- If unsatisfied, go back and adjust ignored groups.<br>- Otherwise, proceed.                  |  <img width="1376" height="723" alt="image" src="https://github.com/user-attachments/assets/c0950003-4227-4277-b846-8511bcb7209f" /> |
| **7. Relabel Interactive Elements** | - Search for the element in the sidebar.<br>- Click **Edit** (Figure C-8).<br>- Select the element on canvas.<br>- Choose a new label and save. | <img width="1376" height="723" alt="image" src="https://github.com/user-attachments/assets/98268e56-61ea-4f92-aa93-84a14fe992ee" /> <br> <img width="1376" height="723" alt="image" src="https://github.com/user-attachments/assets/04fd92c2-5226-4164-a30c-6eee5ddd8d8e" /> |

---

## ⚙️ Component Extraction

| Step                      | Instruction                                                                                                                                | Example                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| **8. Extract Components** | - **Delete groups** you don’t want as components.<br>- **Merge groups** into a new component by selecting multiple groups and naming them. | <img width="1376" height="723" alt="image" src="https://github.com/user-attachments/assets/ad923e46-66b2-4d0b-bd99-4cf495fed1ec" /> |

---

## 💻 Code Generation

| Step                               | Instruction                                                                                                                                                                            | Example                                                                                      |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **9. Generate Your React Project** | - Enter a **project name** (must follow `npx create-react-app` conventions).<br>- Select a save location.<br>- The app will generate a full **Next.js project** with all dependencies. | <img width="1203" height="631" alt="image" src="https://github.com/user-attachments/assets/8cc2cd96-0d49-4bb5-a657-060d5fd554bb" /> |
| **10. Run Your Code**              | - Navigate to your project folder and run:<br>`npm run dev`<br>Your Figma design is now live as a React app! <br> or <br> you can run the project from within the tool as it includes a live update preview and terminal (Full Code Editor) | <img width="1109" height="582" alt="image" src="https://github.com/user-attachments/assets/f163b0c6-c6f6-4bc1-817f-8fe7a1c7cce1" /> |

---

## 📂 Managing Projects

| Step                       | Instruction                                                                                           | Example |
| -------------------------- | ----------------------------------------------------------------------------------------------------- | ------- |
| **11. Dashboard Projects** | Saved projects appear on the dashboard.<br>You can delete them without affecting your generated code. | <img width="1380" height="725" alt="image" src="https://github.com/user-attachments/assets/220d967f-f426-4e93-afda-e014285f5b6e" /> |
