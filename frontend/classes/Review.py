class Review:
    def __init__(self, id, reservation_id, rating, comment):
        self.id = id
        self.reservation_id = reservation_id
        self.rating = rating
        self.comment = comment

    def show_review(self):
        print(f"Rating: {self.rating}, Comment: {self.comment}")