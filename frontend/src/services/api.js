import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          id
          name
          email
          role
          store {
            id
            name
            rentAmount
          }
          managedMall {
            id
            name
          }
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`;

export const GET_MALLS = gql`
  query GetMalls {
    malls {
      id
      name
      stores {
        id
        name
      }
    }
  }
`;

export const GET_MALL = gql`
  query GetMall($id: ID!) {
    mall(where: { id: $id }) {
      id
      name
      stores {
        id
        name
        rentAmount
        owner {
          id
          name
          email
        }
        payments {
          id
        }
      }
    }
  }
`;

export const GET_STORES = gql`
  query GetStores {
    stores {
      id
      name
      rentAmount
      mall {
        id
        name
      }
      owner {
        id
        name
        email
      }
    }
  }
`;

export const GET_STORE = gql`
  query GetStore($id: ID!) {
    store(where: { id: $id }) {
      id
      name
      rentAmount
      mall {
        id
        name
      }
      owner {
        id
        name
        email
      }
      payments {
        id
        amount
        createdAt
      }
    }
  }
`;

export const GET_PAYMENTS = gql`
  query GetPayments {
    payments {
      id
      amount
      createdAt
      store {
        id
        name
      }
      user {
        id
        name
      }
    }
  }
`;

export const GET_PAYMENT_HISTORY = gql`
  query GetPaymentHistory($storeId: ID) {
    payments(
      where: { store: { id: { equals: $storeId } } }
      orderBy: [{ createdAt: desc }]
    ) {
      id
      amount
      createdAt
      store {
        id
        name
      }
      user {
        id
        name
      }
    }
  }
`;

export const CREATE_PAYMENT = gql`
  mutation CreatePayment($data: PaymentCreateInput!) {
    createPayment(data: $data) {
      id
      amount
      createdAt
      store {
        id
        name
      }
      user {
        id
        name
      }
    }
  }
`;

export const GET_MONTHLY_REVENUE = gql`
  query GetMonthlyRevenue {
    payments {
      id
      amount
      createdAt
      store {
        id
        name
        mall {
          id
          name
        }
      }
    }
  }
`;

export const handleAuthResponse = (response) => {
  const { authenticateUserWithPassword: authResult } = response.data;
  
  if ('message' in authResult) {
    throw new Error(authResult.message);
  }
  
  return {
    data: {
      success: true,
      user: authResult.item,
      sessionToken: authResult.sessionToken
    }
  };
};

export const createPayment = async (variables) => {
  return {
    data: {
      amount: variables.amount,
      store: variables.store
    }
  };
};

export const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return true;
}; 