/**
 * Represents user's name information
 */
export interface UserName {
  /** User's title (e.g., Mr., Mrs., Ms.) */
  title: string;
  /** User's first name */
  first: string;
  /** User's last name */
  last: string;
}

/**
 * Represents user's picture URLs in different sizes
 */
export interface UserPicture {
  /** Large size picture URL */
  large: string;
  /** Medium size picture URL */
  medium: string;
  /** Thumbnail size picture URL */
  thumbnail: string;
}

/**
 * Represents user's login information
 */
export interface UserLogin {
  /** Unique identifier for the user */
  uuid: string;
  /** User's username */
  username: string;
}

/**
 * Represents user's location information
 */
export interface UserLocation {
  /** User's country */
  country: string;
  /** User's city */
  city: string;
  /** User's state */
  state: string;
  /** User's street information */
  street: {
    number: number;
    name: string;
  };
  /** User's postcode */
  postcode: string;
}

/**
 * Represents user's date of birth information
 */

export interface UserDob {
  /** Date of birth as ISO string */
  date: string;
  /** User's age */
  age: number;
}

/**
 * Represents a complete user object
 */
export interface User {
  /** User's gender */
  gender: string;
  /** User's name information */
  name: UserName;
  /** User's location information */
  location: UserLocation;
  /** User's email address */
  email: string;
  /** User's date of birth */
  dob: UserDob;
  /** User's phone number */
  phone: string;
  /** User's cell phone number */
  cell: string;
  /** User's nationality */
  nat: string;
  /** User's picture URLs */
  picture: UserPicture;
  /** User's login information */
  login: UserLogin;
}

/**
 * Represents the API response structure
 */
export interface ApiResponse {
  /** Array of user results */
  results: User[];
  /** Response metadata */
  info: {
    /** Current page number */
    page: number;
    /** Number of results in this response */
    results: number;
    /** Random seed used for this request */
    seed: string;
    /** API version */
    version: string;
  };
}

/**
 * Represents the state management for users
 */
export interface UserState {
  /** Array of loaded users */
  users: User[];
  /** Loading state indicator */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Current page number */
  page: number;
  /** Indicates if more users can be loaded */
  hasMore: boolean;
}
