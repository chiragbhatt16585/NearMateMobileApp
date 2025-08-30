import { getAuthEndpoint, buildApiUrl } from '../config/api';
import { Address, CreateAddressRequest, UpdateAddressRequest, AddressResponse } from '../types/address';

class AddressService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = buildApiUrl('/api/v1/end-users');
  }

  // Get auth token from storage
  private async getAuthToken(): Promise<string | null> {
    try {
      const { apiClient } = await import('./api');
      return apiClient.getAccessToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // List all addresses for a user
  async getAddresses(endUserId: string): Promise<Address[]> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/${endUserId}/addresses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch addresses: ${response.status}`);
      }

      const data: AddressResponse = await response.json();
      return data.addresses || [];
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  }

  // Get a specific address
  async getAddress(endUserId: string, addressId: string): Promise<Address> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/${endUserId}/addresses/${addressId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch address: ${response.status}`);
      }

      const data: AddressResponse = await response.json();
      return data.address;
    } catch (error) {
      console.error('Error fetching address:', error);
      throw error;
    }
  }

  // Create a new address
  async createAddress(endUserId: string, addressData: CreateAddressRequest): Promise<Address> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/${endUserId}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create address: ${response.status}`);
      }

      const data: AddressResponse = await response.json();
      return data.address;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  }

  // Update an existing address
  async updateAddress(endUserId: string, addressId: string, addressData: UpdateAddressRequest): Promise<Address> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/${endUserId}/addresses/${addressId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update address: ${response.status}`);
      }

      const data: AddressResponse = await response.json();
      return data.address;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  // Set an address as default
  async setDefaultAddress(endUserId: string, addressId: string): Promise<Address> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/${endUserId}/addresses/${addressId}/set-default`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to set default address: ${response.status}`);
      }

      const data: AddressResponse = await response.json();
      return data.address;
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }

  // Delete an address
  async deleteAddress(endUserId: string, addressId: string): Promise<void> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/${endUserId}/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete address: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }
}

export const addressService = new AddressService();
export default addressService;
