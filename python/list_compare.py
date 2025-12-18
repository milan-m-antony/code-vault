def read_int_list(prompt_count, prompt_item):
    lst = []
    try:
        n = int(input(prompt_count))
    except ValueError:
        print("Invalid number; using 0.")
        return lst
    for i in range(n):
        while True:
            try:
                v = int(input(prompt_item))
                lst.append(v)
                break
            except ValueError:
                print("Please enter an integer.")
    return lst


def main():
    list1 = read_int_list("Enter number of elements in list 1: ", "Enter element: ")
    list2 = read_int_list("Enter number of elements in list 2: ", "Enter element: ")

    print("List 1:", list1)
    print("List 2:", list2)

    if len(list1) == len(list2):
        print("Both lists are of equal length")
    else:
        print("Lists are of different length")

    sum1 = sum(list1)
    sum2 = sum(list2)
    if sum1 == sum2:
        print("Both lists have equal sum")
    else:
        print("Lists have different sums")

    common = set(list1).intersection(list2)
    if common:
        print("Both lists have common values:", sorted(common))
    else:
        print("No common values found")


if __name__ == '__main__':
    main()
