class Attendance:
    def __init__(self, id, clipper_id, work_date, check_in_time, check_out_time, status):
        self.id = id
        self.clipper_id = clipper_id
        self.work_date = work_date
        self.check_in_time = check_in_time
        self.check_out_time = check_out_time
        self.status = status

    def check_in(self):
        print("Check-in")

    def check_out(self):
        print("Check-out")