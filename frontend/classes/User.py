class User:
    def __init__(self, id, name, email, phone, password_hash, role, status, created_at, updated_at):
        self.id = id
        self.name = name
        self.email = email
        self.phone = phone
        self.password_hash = password_hash
        self.role = role
        self.status = status
        self.created_at = created_at
        self.updated_at = updated_at

    def login(self):
        print(f"{self.name} login")

    def register(self):
        print(f"{self.name} register")