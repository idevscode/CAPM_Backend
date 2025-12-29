using { company as my } from '../db/schema';

service OrderService {
  entity Orders as projection on my.Orders;
}

