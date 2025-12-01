import { getUser, getOrderHistory } from '../auth.js'
(async function run() {
    const container = document.getElementById('orders-container');
    container.innerHTML = 'Loading...';
  
    try {
      const user = await getUser();
      if (!user) {
        container.innerHTML = `<p>You must be logged in to view order history. <a href="./login.html">Log in</a></p>`;
        return;
      }
  
      const tickets = await getOrderHistory(user);
  
      if (!tickets || tickets.length === 0) {
        container.innerHTML = '<p>No orders found.</p>';
        return;
      }
  
      container.innerHTML = '';
      const list = document.createElement('div');
      list.className = 'orders-list';
  
      tickets.forEach(t => {
        const card = document.createElement('div');
        card.className = 'order-card';
        const movieTitle = t.movie?.title ?? `Movie #${t.movieId}`;
        const showtime = t.showtime ? new Date(t.showtime).toLocaleString() : 'Unknown showtime';
        const createdAt = t.createdAt ? new Date(t.createdAt).toLocaleString() : '';
        card.innerHTML = `
          <h3>${movieTitle}</h3>
          <p><strong>Showtime:</strong> ${showtime}</p>
          <p><strong>Theater:</strong> ${t.theater}</p>
          <p><strong>Price:</strong> $${(t.price ?? 0).toFixed(2)}</p>
          <p><strong>Order ID / Ticket:</strong> ${t.id}</p>
          <p><small>Ordered: ${createdAt}</small></p>
        `;
        list.appendChild(card);
      });
  
      container.appendChild(list);
    } catch (err) {
      console.error(err);
      container.innerHTML = '<p>Error loading orders.</p>';
    }
  })();