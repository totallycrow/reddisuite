import { create } from "zustand";

const usePostsStore = create((set) => ({
  posts: [],

  addPost: (post: any) => set((state) => ({ posts: [...state, post] })),
  removeAllPosts: () => set({ posts: [] }),
}));

export default usePostsStore;
