import React from "react";
import { Form } from "../components/Form"

export default function Home() {
  const mockAddProduct = (data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(data);
        resolve(data);
      }, 500);
    });
  };


  return (
    <div>
      <Form login={mockAddProduct} />
    </div>
  )
}