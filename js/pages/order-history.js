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
        const movieTitle = t.movieTitle;
        const showtime = t.showtime ? new Date(t.showtime).toLocaleString() : 'Unknown showtime';
        const createdAt = t.createdAt ? new Date(t.createdAt).toLocaleString() : '';
        card.innerHTML = `
          <h3 style="margin-top:0;">${movieTitle}</h3>
          <p><strong>Showtime:</strong> ${showtime}</p>
          <p><strong>Theater:</strong> ${t.theater}</p>
          <p><strong>Price:</strong> $${(t.price ?? 0).toFixed(2)}</p>
          <p><strong>Barcode:</strong> ${t.id}</p>
          ${createdAt ? `<p style="margin-top:-0.5rem;"><small>Ordered: ${createdAt}</small></p>` : ""}
        `;

        const buttons = document.createElement('div');
        buttons.className = 'buttons';

        let displayButton = document.createElement('button');
        displayButton.textContent = 'Display';

        let printButton = document.createElement('button');
        printButton.textContent = 'Print';

        const copy = card.cloneNode(true);
        displayButton.addEventListener('click', () => {
          displayTicket(copy);
        });

        printButton.addEventListener('click', () => {
          printTicket(copy);
        });
        
        buttons.append(displayButton, printButton)
        card.append(buttons);

        list.appendChild(card);
      });
  
      container.appendChild(list);
    } catch (err) {
      console.error(err);
      container.innerHTML = '<p>Error loading orders.</p>';
    }
  })();

function displayTicket(ticket) {
  const displayWindow = window.open("", "", "width=800, height=600");
  displayWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          body { font-family: Arial; margin: 20px; }
        </style>
      </head>
      <body>${ticket.innerHTML}</body>
    </html>
  `);
  displayWindow.document.close();
  displayWindow.focus();
}

function printTicket(ticket) {
  const printWindow = window.open("", "", "width=800, height=600");
  printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          body { font-family: Arial; margin: 20px; }
        </style>
      </head>
      <body>${ticket.innerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

