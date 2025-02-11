io.on('connection', (socket) => {
  // Handle QR code scan
  socket.on('qrCodeScanned', (data) => {
    // Broadcast to all clients that QR was scanned
    io.emit('orderStatusUpdated', {
      orderId: data.orderId,
      status: 'payment_processing'
    });
  });
});
