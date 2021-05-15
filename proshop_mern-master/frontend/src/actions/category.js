import axios from "axios";

export const getCategories = async () =>
  await axios.get(`/api/products/categories`);

export const getCategory = async (slug) =>
  await axios.get(`/api/products/category/${slug}`);
