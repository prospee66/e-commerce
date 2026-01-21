import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const exists = state.items.find((item) => item.id === product.id)
          if (exists) return state

          return {
            items: [...state.items, product],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }))
      },

      isInWishlist: (productId) => {
        const { items } = get()
        return items.some((item) => item.id === productId)
      },

      clearWishlist: () => {
        set({ items: [] })
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
)

export default useWishlistStore
