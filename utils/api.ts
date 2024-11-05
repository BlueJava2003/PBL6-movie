// import queryString from "query-string";
// import { refreshToken } from "./refreshToken";

// export const sendRequest = async <T>(props: IRequest): Promise<T> => {
//   let {
//     url,
//     method,
//     body,
//     queryParams = {},
//     useCredentials = false,
//     headers = {},
//     nextOption = {},
//   } = props;

//   const options: any = {
//     method: method,
//     headers: new Headers({ "content-type": "application/json", ...headers }),
//     body: body ? JSON.stringify(body) : null,
//     ...nextOption,
//   };

//   if (useCredentials) options.credentials = "include";

//   if (queryParams) {
//     url = `${url}?${queryString.stringify(queryParams)}`;
//   }

//   const makeRequest = async (): Promise<T> => {
//     const response = await fetch(url, options);

//     if (response.status === 401) {
//       // Xử lý khi accessToken hết hạn
//       const newAccessToken = await refreshToken();

//       if (newAccessToken) {
//         // Cập nhật token vào header và thử lại request
//         headers["Authorization"] = `Bearer ${newAccessToken}`;
//         options.headers = new Headers({
//           "content-type": "application/json",
//           ...headers,
//         });

//         const retryResponse = await fetch(url, options);

//         if (retryResponse.ok) {
//           return retryResponse.json() as T;
//         } else {
//           return retryResponse.json().then(
//             (json) =>
//               ({
//                 statusCode: retryResponse.status,
//                 message: json?.message ?? "",
//                 error: json?.error ?? "",
//               } as T)
//           );
//         }
//       } else {
//         // Không thể refresh token, trả về lỗi
//         return {
//           statusCode: 401,
//           message: "Unauthorized",
//           error: "Failed to refresh token",
//         } as T;
//       }
//     } else if (response.ok) {
//       return response.json() as T;
//     } else {
//       return response.json().then(
//         (json) =>
//           ({
//             statusCode: response.status,
//             message: json?.message ?? "",
//             error: json?.error ?? "",
//           } as T)
//       );
//     }
//   };

//   return makeRequest();
// };
import queryString from "query-string";
import { refreshToken } from "./refreshToken";

export const sendRequest = async <T>(props: IRequest): Promise<T> => {
  let { url, method, body, queryParams = {}, useCredentials = false, headers = {}, nextOption = {} } = props;

  const options: any = {
    method: method,
    headers: new Headers({ "content-type": "application/json", ...headers }),
    body: body ? JSON.stringify(body) : null,
    ...nextOption,
  };

  if (useCredentials) options.credentials = "include";

  // Thêm query parameters vào URL nếu có
  if (queryParams) {
    url = `${url}?${queryString.stringify(queryParams)}`;
  }

  const makeRequest = async (): Promise<T> => {
    try {
      const response = await fetch(url, options);

      if (response.status === 401) {
        // Xử lý khi accessToken hết hạn
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
          // Cập nhật token vào header và thử lại request
          headers["Authorization"] = `Bearer ${newAccessToken}`;
          options.headers = new Headers({
            "content-type": "application/json",
            ...headers,
          });

          const retryResponse = await fetch(url, options);

          if (retryResponse.ok) {
            return retryResponse.json() as T;
          } else {
            return retryResponse.json().then(
              (json) =>
                ({
                  statusCode: retryResponse.status,
                  message: json?.message ?? "",
                  error: json?.error ?? "",
                } as T)
            );
          }
        } else {
          // Không thể refresh token, trả về lỗi
          return {
            statusCode: 401,
            message: "Unauthorized",
            error: "Failed to refresh token",
          } as T;
        }
      } else if (response.ok) {
        return response.json() as T;
      } else {
        return response.json().then(
          (json) =>
            ({
              statusCode: response.status,
              message: json?.message ?? "",
              error: json?.error ?? "",
            } as T)
        );
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      // Trả về thông báo lỗi nếu fetch thất bại
      return {
        statusCode: 500,
        message: "Internal Server Error",
        error: "Fetch request failed",
      } as T;
    }
  };

  return makeRequest();
};
