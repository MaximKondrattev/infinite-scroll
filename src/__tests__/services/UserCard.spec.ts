import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import UserCard from "@/components/UserCard.vue";
import type { User } from "@/entities/user";

const mockUser: User = {
  login: { uuid: "123", username: "johndoe" },
  name: { title: "Mr", first: "John", last: "Doe" },
  email: "john@example.com",
  picture: {
    large: "large-url",
    medium: "medium-url",
    thumbnail: "thumb-url",
  },
  location: {
    street: { number: 123, name: "Main St" },
    city: "New York",
    state: "NY",
    postcode: "10001",
    country: "USA",
  },
  phone: "1234567890",
  cell: "0987654321",
  nat: "US",
  dob: { date: "1990-01-01", age: 33 },
  gender: "male",
};

describe("UserCard", () => {
  it("renders properly", () => {
    const wrapper = mount(UserCard, {
      props: {
        user: mockUser,
      },
    });

    expect(wrapper.find(".user-card__name").text()).toBe("John Doe");
  });

  // Добавляем больше тестов...
});
