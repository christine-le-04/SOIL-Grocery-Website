import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "./Cart";
import * as repository from "../data/repository";
import { MemoryRouter } from "react-router-dom";
import { act } from 'react-dom/test-utils';

// Global data for tests.
let container;

// Create mock data for the user
const mockUser = {
  email: 'janedoe@email.com',
  username: 'JaneDoe',
  password_hash: 'Test!123',
  first_name: 'Jane',
  last_name: 'Doe',
  date_created: '2024-05-30'
};

// Create mock data for the order/products joint table
var mockOrders = [
  {
    order_id: 1,
    quantity: 1,
    email_id: 'janedoe@email.com',
    product_id: 1, 
    product: {
      product_id: 1, 
      product_name: 'Banana', 
      description: 'Banana drescription', 
      price: 0.8, 
      image_url: 'https://images.unsplash.com/photo-1587334206596-c0f9f7dccbe6?q=80&w=1781&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      is_special: 'Yes'
      }
    },
    {
      order_id: 2,
      quantity: 2,
      email_id: 'janedoe@email.com',
      product_id: 2, 
      product: {
        product_id: 2, 
        product_name: 'Kiwi', 
        description: 'Kiwi drescription', 
        price: 0.8, 
        image_url: 'https://images.unsplash.com/photo-1587334106914-b90ecebe9845?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        is_special: 'Yes'
        }
      },
      {
        order_id: 3,
        quantity: 3,
        email_id: 'janedoe@email.com',
        product_id: 3, 
        product: {
          product_id: 3, 
          product_name: 'Tomato', 
          description: 'Tomato drescription', 
          price: 0.7, 
          image_url: 'https://images.unsplash.com/photo-1587486938113-d6d38d424efa?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          is_special: 'Yes'
          }
        }
  ];
  

// Runs before each test, here the Cart component is rendered and the container is stored.
beforeEach( async () => {
  jest.spyOn(repository, 'getOrdersFromUser').mockResolvedValue(mockOrders);

  await act(async () => {
    const utils = render(
      <MemoryRouter>
      <Cart user={[mockUser]}/>
      </MemoryRouter>
    );

    container = utils.container;
  });
});

// ------------------------------- TESTS START HERE -------------------------------

// Ensure the cart contains all orders 
test("Contains all orders", async () => {

  // mockOrders was set to contain 3 products, so all 3 should be visible on the page
  const bananaText = screen.getByText('Banana');
  const kiwiText = screen.getByText('Kiwi');
  const tomatoText = screen.getByText('Tomato');

  expect(bananaText).toBeInTheDocument();
  expect(kiwiText).toBeInTheDocument();
  expect(tomatoText).toBeInTheDocument();
  
});


// Test that the "Remove All Items" button successfully removes the items from the cart
test("Remove all cart items", async () => {
  const button = screen.getByRole('button', { name: 'Remove all items' })

  // Simulate click on "Remove all items" button
  act(() => {
    fireEvent.click(button)
  })

  const button2 = screen.getByRole('button', { name: 'Clear cart' })

  // Simulate click on "Clear cart" button
  act(() => {
    fireEvent.click(button2)
  })

  // At this point the cart should be cleared, and there should be no products displayed.

  expect(screen.queryByText('Banana')).toBeNull();
  expect(screen.queryByText('Kiwi')).toBeNull();
  expect(screen.queryByText('Tomato')).toBeNull();
});


// Test that we can access the credit card verification 
test("Purchase products", async () => {
  const button = screen.getByRole('button', { name: 'Checkout'})

  act(() => {
    fireEvent.click(button)
  })

  const ccNumber = screen.getByPlaceholderText('Card number');
  // Simulate input.
  fireEvent.input(ccNumber, { target: { value: "1234567890000000" } });

  const ccDate = screen.getByPlaceholderText('MMYY');
  // Simulate input.
  fireEvent.input(ccDate, { target: { value: "0530" } });

  const cvv = screen.getByPlaceholderText('CVV');
  // Simulate input.
  fireEvent.input(cvv, { target: { value: "111" } });

  // Now we should check if we were able to successfully write in all the text fields and that all elements of cc verification are visible

  expect(screen.getByText('Checkout')).toBeInTheDocument();
  expect(ccNumber.value).toBe("1234567890000000");
  expect(ccDate.value).toBe("0530");
  expect(cvv.value).toBe("111");
  expect(screen.getByRole('button', { name: 'Save & confirm'})).toBeInTheDocument();

});