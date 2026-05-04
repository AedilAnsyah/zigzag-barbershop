class ReservationDetail:
    def __init__(self, id, reservation_id, service_id, price_at_booking):
        self.id = id
        self.reservation_id = reservation_id
        self.service_id = service_id
        self.price_at_booking = price_at_booking

    def get_total_price(self):
        return self.price_at_booking