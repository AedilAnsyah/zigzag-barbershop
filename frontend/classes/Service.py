class Service:
    def __init__(self, id, name, description, current_price, duration_mins, is_active):
        self.id = id
        self.name = name
        self.description = description
        self.current_price = current_price
        self.duration_mins = duration_mins
        self.is_active = is_active

    def get_price(self):
        return self.current_price