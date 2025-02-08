import { DBService } from '../../services/db.service';
import axios from 'axios';
import { config } from '../../config';

export class POSCloverService extends DBService {
  cloverECommerceServiceUrl = config.clover.eCommerceServiceUrl;
  cloverECommercePrivateToken = config.clover.eCommercePrivateToken;

  async createCharge(data: {
    amount: number;
    currency: string;
    source: string;
    description?: string;
  }) {
    const response = await axios.post(
      `${this.cloverECommerceServiceUrl}/charges`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.cloverECommercePrivateToken}`
        }
      }
    );

    return response.data;
  }
}
