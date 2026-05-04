class Reservation:
    def __init__(self, id, order_id, customer_id, clipper_id, booking_date, start_time, status):
        self.id = id
        self.order_id = order_id
        self.customer_id = customer_id
        self.clipper_id = clipper_id
        self.booking_date = booking_date
        self.start_time = start_time
        self.status = status

    def create_booking(self):
        print("Booking dibuat")

    def update_status(self, status):
        self.status = status