class BankAccount:
    def __init__(self, acc_no, name, acc_type, balance):
        self.acc_no = acc_no
        self.name = name
        self.acc_type = acc_type
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        print("Current balance:", self.balance)

    def withdraw(self, amount):
        if amount <= self.balance:
            self.balance -= amount
            print("Current balance:", self.balance)
        else:
            print("Insufficient balance")


if __name__ == '__main__':
    acc_no = input("Enter account number: ")
    name = input("Enter name: ")
    acc_type = input("Enter account type: ")
    balance = float(input("Enter initial balance: "))

    account = BankAccount(acc_no, name, acc_type, balance)
    account.deposit(float(input("Enter deposit amount: ")))
    account.withdraw(float(input("Enter withdraw amount: ")))
