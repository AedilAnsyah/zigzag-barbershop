class Payment:
    def __init__(self, id, reservation_id, midtrans_trx_id, gross_amount, payment_type, paid_at):
        self.id = id
        self.reservation_id = reservation_id
        self.midtrans_trx_id = midtrans_trx_id
        self.gross_amount = gross_amount
        self.payment_type = payment_type
        self.paid_at = paid_at

    def process_payment(self):
        print("Pembayaran diproses")