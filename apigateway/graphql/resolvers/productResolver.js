const Product = require('../../models/product');

module.exports = {
  Query: {
    products: async () => {
      try {
        return await Product.find();
      } catch (error) {
        throw new Error('Failed to fetch products');
      }
    },

    product: async (_, { id }) => {
      try {
        const product = await Product.findById(id);
        if (!product) {
          throw new Error('Product not found');
        }
        return product;
      } catch (error) {
        throw new Error('Failed to fetch product');
      }
    },

    productsByCategory: async (_, { category }) => {
      try {
        return await Product.find({ category });
      } catch (error) {
        throw new Error('Failed to fetch products by category');
      }
    }
  },

  Mutation: {
    createProduct: async (_, { input }) => {
      try {
        const product = new Product(input);
        return await product.save();
      } catch (error) {
        throw new Error('Failed to create product: ' + error.message);
      }
    },

    updateProduct: async (_, { id, input }) => {
      try {
        const product = await Product.findByIdAndUpdate(
          id, 
          input, 
          { new: true, runValidators: true }
        );
        if (!product) {
          throw new Error('Product not found');
        }
        return product;
      } catch (error) {
        throw new Error('Failed to update product: ' + error.message);
      }
    },

    deleteProduct: async (_, { id }) => {
      try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
          throw new Error('Product not found');
        }
        return true;
      } catch (error) {
        throw new Error('Failed to delete product: ' + error.message);
      }
    }
  }
};