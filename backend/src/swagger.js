const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'E-Commerce Backend API',
    version: '1.0.0',
    description: 'Swagger documentation for the E-Commerce CSEC ASTU Bootcamp backend API',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' },
        },
      },
      AuthRequest: {
        type: 'object',
        properties: {
          fullName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
          role: { type: 'string', example: 'user' },
        },
        required: ['fullName', 'email', 'password'],
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
        required: ['email', 'password'],
      },
      VerifyEmailRequest: {
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
        required: ['token'],
      },
      ResetPasswordRequest: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['token', 'password'],
      },
      PasswordRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
        },
        required: ['email'],
      },
      ProductInput: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          category: { type: 'string' },
          price: { type: 'number' },
          description: { type: 'string' },
          imageUrl: { type: 'string' },
          stock: { type: 'number' },
          featured: { type: 'boolean' },
        },
        required: ['name', 'category', 'price', 'description', 'imageUrl'],
      },
      CartAddRequest: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
          quantity: { type: 'integer', default: 1 },
        },
        required: ['productId'],
      },
      OrderCreateRequest: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                quantity: { type: 'integer' },
              },
            },
          },
          totalPrice: { type: 'number' },
          shippingInfo: {
            type: 'object',
            properties: {
              fullName: { type: 'string' },
              email: { type: 'string', format: 'email' },
              address: { type: 'string' },
            },
          },
          paymentInfo: {
            type: 'object',
            properties: {
              paymentMethod: { type: 'string' },
              cardHolder: { type: 'string' },
              cardNumber: { type: 'string' },
            },
          },
        },
        required: ['items', 'totalPrice', 'shippingInfo', 'paymentInfo'],
      },
      OrderStatusRequest: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
        },
        required: ['status'],
      },
      ContactRequest: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          message: { type: 'string' },
        },
        required: ['firstName', 'lastName', 'email', 'message'],
      },
      PaymentInitializeRequest: {
        type: 'object',
        properties: {
          amount: { type: 'number' },
          email: { type: 'string', format: 'email' },
          first_name: { type: 'string' },
          last_name: { type: 'string' },
        },
        required: ['amount', 'email', 'first_name', 'last_name'],
      },
      WishlistAddRequest: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
        },
        required: ['productId'],
      },
      ChatRequest: {
        type: 'object',
        properties: {
          messages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                role: { type: 'string', example: 'user' },
                content: { type: 'string' },
              },
              required: ['role', 'content'],
            },
          },
        },
        required: ['messages'],
      },
      AboutRequest: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
        },
        required: ['content'],
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Authentication and user session routes' },
    { name: 'Products', description: 'Product catalog endpoints' },
    { name: 'Cart', description: 'Shopping cart operations' },
    { name: 'Orders', description: 'Order management and admin order APIs' },
    { name: 'Admin', description: 'Admin-only dashboard endpoints' },
    { name: 'Users', description: 'User profile and admin user endpoints' },
    { name: 'Wishlist', description: 'Wishlist functionality' },
    { name: 'Contact', description: 'Contact form endpoint' },
    { name: 'Payment', description: 'Payment initialization endpoint' },
    { name: 'Upload', description: 'Image upload endpoint' },
    { name: 'AI Chat', description: 'AI chat assistant endpoint' },
    { name: 'About', description: 'About page content endpoints' },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthRequest' },
            },
          },
        },
        responses: {
          '201': { description: 'User created' },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/auth/verify-email': {
      post: {
        tags: ['Auth'],
        summary: 'Verify an email address using a token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VerifyEmailRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Email verified successfully' },
          '400': { description: 'Invalid or expired token', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful' },
          '400': { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout the current user',
        responses: {
          '200': { description: 'Successfully logged out' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get the current authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Current user profile' },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request a password reset email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PasswordRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Password reset request accepted' },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset a user password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ResetPasswordRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Password reset successful' },
          '400': { description: 'Invalid token or validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'List all products',
        responses: {
          '200': { description: 'Product array returned' },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Create a new product (Admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductInput' },
            },
          },
        },
        responses: {
          '201': { description: 'Product created' },
          '403': { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get a product by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Product returned' },
          '404': { description: 'Product not found' },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Update a product by ID (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Product updated' },
          '404': { description: 'Product not found' },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete a product by ID (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Product deleted' },
          '404': { description: 'Product not found' },
        },
      },
    },
    '/api/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Get the current user\'s cart',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Cart returned' } },
      },
    },
    '/api/cart/add': {
      post: {
        tags: ['Cart'],
        summary: 'Add an item to the cart',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CartAddRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Item added to cart' },
        },
      },
    },
    '/api/cart/remove/{productId}': {
      delete: {
        tags: ['Cart'],
        summary: 'Remove an item from the cart',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Item removed' } },
      },
    },
    '/api/cart/clear': {
      delete: {
        tags: ['Cart'],
        summary: 'Clear the current cart',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Cart cleared' } },
      },
    },
    '/api/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Create a new order',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderCreateRequest' },
            },
          },
        },
        responses: { '201': { description: 'Order created' } },
      },
      get: {
        tags: ['Orders'],
        summary: 'Get current user orders',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Order list returned' } },
      },
    },
    '/api/orders/admin': {
      get: {
        tags: ['Orders'],
        summary: 'Get all orders for admin',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Admin order list returned' } },
      },
    },
    '/api/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get a single order by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Order returned' }, '404': { description: 'Order not found' } },
      },
    },
    '/api/orders/{id}/status': {
      put: {
        tags: ['Orders'],
        summary: 'Update an order status (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderStatusRequest' },
            },
          },
        },
        responses: { '200': { description: 'Order status updated' } },
      },
    },
    '/api/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'Get all users (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'User list returned' } },
      },
    },
    '/api/admin/stats': {
      get: {
        tags: ['Admin'],
        summary: 'Get admin dashboard statistics',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Statistics returned' } },
      },
    },
    '/api/admin/messages': {
      get: {
        tags: ['Admin'],
        summary: 'Get all contact messages (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Messages returned' } },
      },
    },
    '/api/admin/messages/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Get a single contact message',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Message returned' }, '404': { description: 'Message not found' } },
      },
      patch: {
        tags: ['Admin'],
        summary: 'Update a contact message status',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { status: { type: 'string' } }, required: ['status'] } },
          },
        },
        responses: { '200': { description: 'Message updated' } },
      },
      delete: {
        tags: ['Admin'],
        summary: 'Delete a contact message',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Message deleted' } },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Get all users (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Users returned' } },
      },
    },
    '/api/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'User profile returned' } },
      },
    },
    '/api/wishlist': {
      get: {
        tags: ['Wishlist'],
        summary: 'Get current user wishlist',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Wishlist returned' } },
      },
    },
    '/api/wishlist/add': {
      post: {
        tags: ['Wishlist'],
        summary: 'Add a product to wishlist',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WishlistAddRequest' },
            },
          },
        },
        responses: { '200': { description: 'Product added to wishlist' } },
      },
    },
    '/api/wishlist/remove/{productId}': {
      delete: {
        tags: ['Wishlist'],
        summary: 'Remove a product from wishlist',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Product removed from wishlist' } },
      },
    },
    '/api/contact': {
      post: {
        tags: ['Contact'],
        summary: 'Submit a contact message',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ContactRequest' },
            },
          },
        },
        responses: { '201': { description: 'Message created' }, '400': { description: 'Validation error' } },
      },
    },
    '/api/payment/initialize': {
      post: {
        tags: ['Payment'],
        summary: 'Initialize a payment session',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PaymentInitializeRequest' },
            },
          },
        },
        responses: { '200': { description: 'Payment initialized' }, '400': { description: 'Payment validation failed' } },
      },
    },
    '/api/upload': {
      post: {
        tags: ['Upload'],
        summary: 'Upload an image file',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: { type: 'string', format: 'binary' },
                },
                required: ['image'],
              },
            },
          },
        },
        responses: { '200': { description: 'File uploaded successfully' }, '400': { description: 'File upload error' } },
      },
    },
    '/api/chat': {
      post: {
        tags: ['AI Chat'],
        summary: 'Send messages to the AI chat assistant',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChatRequest' },
            },
          },
        },
        responses: { '200': { description: 'AI reply returned' }, '400': { description: 'Invalid request' } },
      },
    },
    '/api/about': {
      get: {
        tags: ['About'],
        summary: 'Get about page content',
        responses: { '200': { description: 'About content returned' } },
      },
      post: {
        tags: ['About'],
        summary: 'Create or update about content',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AboutRequest' },
            },
          },
        },
        responses: { '200': { description: 'About content created or updated' }, '400': { description: 'Validation error' } },
      },
    },
  },
};

export default swaggerDocument;
