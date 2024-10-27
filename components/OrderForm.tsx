import { useState } from 'react';
import Swal from 'sweetalert2';

interface OrderFormProps {
  orderData?: any; // Optional, for editing an existing order
  onSubmit: (order: any) => void; // Function to handle form submission
}

const OrderForm: React.FC<OrderFormProps> = ({ orderData, onSubmit }) => {
  const [order, setOrder] = useState(orderData || {
    name: '',
    whatsappNumber: '',
    services: '',
    brief: '',
    deadline: '',
    price: '',
    status: 'in queue',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setOrder((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(order); // Send the form data to the parent component or API
    Swal.fire('Success', 'Order has been submitted', 'success');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div>
        <label>Name</label>
        <input name="name" value={order.name} onChange={handleChange} required className="input" />
      </div>
      <div>
        <label>WhatsApp Number</label>
        <input name="whatsappNumber" value={order.whatsappNumber} onChange={handleChange} required className="input" />
      </div>
      <div>
        <label>Services</label>
        <select name="services" value={order.services} onChange={handleChange} required className="input">
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="Coding">Coding</option>
          {/* Add other services as needed */}
        </select>
      </div>
      <div>
        <label>Brief</label>
        <textarea name="brief" value={order.brief} onChange={handleChange} required className="input" />
      </div>
      <div>
        <label>Deadline</label>
        <input name="deadline" value={order.deadline} onChange={handleChange} type="date" required className="input" />
      </div>
      <div>
        <label>Price</label>
        <input name="price" value={order.price} onChange={handleChange} required className="input" />
      </div>
      <div>
        <label>Status</label>
        <select name="status" value={order.status} onChange={handleChange} required className="input">
          <option value="in queue">In Queue</option>
          <option value="in progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
};

export default OrderForm;
