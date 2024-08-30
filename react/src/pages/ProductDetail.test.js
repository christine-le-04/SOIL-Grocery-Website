import { render, screen, fireEvent } from "@testing-library/react";
import * as repository from "../data/repository";
import { MemoryRouter } from "react-router-dom";
import { act } from 'react-dom/test-utils';
import ProductDetail from "./ProductDetail";

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

// Create mock data for product
const mockProduct = {
  product_id: 1, 
  product_name: 'Banana', 
  description: 'Banana drescription', 
  price: 0.8, 
  image_url: 'https://images.unsplash.com/photo-1587334206596-c0f9f7dccbe6?q=80&w=1781&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  is_special: 'Yes'
}

// Create mock data for reviews
const mockAllReviews = [
  { post_id: 1, username: 'user1', text: 'Great product!', rating: 5 },
  { post_id: 2, username: 'user2', text: 'Not bad', rating: 3 },
];

const mockNewReview = { post_id: 3, username: 'user1', text: 'Great product!', rating: 5 };

beforeEach( async () => {
  jest.spyOn(repository, 'getRelevantPosts').mockResolvedValue(mockAllReviews);
  jest.spyOn(repository, 'getCurrProduct').mockResolvedValue(mockProduct);
  jest.spyOn(repository, 'createPost').mockResolvedValue(mockNewReview);

  await act(async () => {
    const utils = render(
      <MemoryRouter>
      <ProductDetail user={[mockUser]}/>
      </MemoryRouter>
    );

    container = utils.container;
  });
});

// ------------------------------- TESTS START HERE -------------------------------

test("Creating a post/review", async () => {
  // simulates "write review" button click
  const start = screen.getByRole('button', { name: 'Write Review' })
  act(() => {
    fireEvent.click(start)
  })

  // tests input for drop down star rating
  const starRating = screen.getByRole('combobox');
  fireEvent.change(starRating, { target: { value: "5" } });

  // tests input for review text
  const reviewText = screen.getByRole('textbox');
  fireEvent.change(reviewText, { target: { value: "Bananas!!" } });

  // simulates "post" button click
  const submit = screen.getByText('Post');
  act(() => {
    fireEvent.click(submit)
  })

  // checks if review post was successfully posted and displayed
  expect(starRating.value).toBe("5");
  expect(reviewText.value).toBe("Bananas!!");
});
