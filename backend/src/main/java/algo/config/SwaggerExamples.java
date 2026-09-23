package algo.config;

public final class SwaggerExamples {

    private SwaggerExamples() {

    }

    public static final String TEAM_MEMBER_404 = """
            {
              "timestamp": "2026-09-17T13:49:13.9175079",
              "status": 404,
              "error": "Not Found",
              "message": "Team member not found with ID: 8",
              "path": "/api/team-members/8",
              "validationErrors": null
            }
            """;

    public static final String TEAM_MEMBER_400 = """
            {
              "timestamp": "2026-09-17T13:51:51.4750705",
              "status": 400,
              "error": "Bad Request",
              "message": "Request validation failed.",
              "path": "/api/team-members/12",
              "validationErrors": {
                "lastName": "Last name cannot be blank."
              }
            }
            """;

    public static final String PROJECT_404 = """
            {
              "timestamp": "2026-09-23T17:48:16.1968148",
              "status": 404,
              "error": "Not Found",
              "message": "Project not found: 42",
              "path": "/api/projects/42",
              "validationErrors": null
            }
            """;

    public static final String PROJECT_400 = """
            {
              "timestamp": "2026-09-23T17:54:57.172884",
              "status": 400,
              "error": "Bad Request",
              "message": "Post validation failed.",
              "path": "/api/posts/1",
              "validationErrors": {
                "thumbnailUrl": "Field cannot be blank for this type.",
                "imageUrls": "Field cannot be blank for this type."
              }
            }
            """;

    public static final String POST_404 = """
            {
              "timestamp": "2026-09-17T13:57:38.817079",
              "status": 404,
              "error": "Not Found",
              "message": "Temporary post not found: 100",
              "path": "/api/posts/100",
              "validationErrors": null
            }
            """;

    public static final String POST_400 = """
            {
                "timestamp": "2026-09-22T16:59:33.0343148",
                "status": 400,
                "error": "Bad Request",
                "message": "Post validation failed.",
                "path": "/api/posts",
                "validationErrors": {
                    "thumbnailUrl": "Field cannot be blank for this type.",
                    "imageUrls": "Field cannot be blank for this type."
                }
            }
            """;

    public static final String POSTS_PAGINATED_200 = """
            {
              "items": [
                {
                  "postId": 2,
                  "postType": "NEWS",
                  "eventDate": "2026-08-25T18:00:00",
                  "startsAt": "2026-08-19T12:00:00",
                  "expiresAt": "2026-09-01T23:59:59",
                  "thumbnailUrl": "https://example.com/thumb.webp",
                  "imageUrls": [
                    "https://example.com/1.webp",
                    "https://example.com/2.webp"
                  ],
                  "externalLink": "https://example.com/more-info",
                  "translations": [
                    {
                      "translationId": 6,
                      "languageCode": "DE",
                      "title": "New event in KN Algo",
                      "shortDescription": "Short teaent.",
                      "fullDescription": "<b>Full, deta<b>re can be much more text.</b></b>"
                    },
                    {
                      "translationId": 5,
                      "languageCode": "EN",
                      "title": "New event in KN Algo",
                      "shortDescription": "Short teaser of our event.",
                      "fullDescription": "<b>Full, detailed description of our new blog post.</b> Here can be much more text."
                    },
                    {
                      "translationId": 4,
                      "languageCode": "PL",
                      "title": "Nowe wydarzenie w KN Algo",
                      "shortDescription": "Krótki zajawka naszego wydarzenia.",
                      "fullDescription": "<b>Pełny, szczegółowy opis naszego nowego wpisu na blogu.</b> Tutaj może być dużo więcej tekstu."
                    }
                  ]
                },
                {
                  "postId": 3,
                  "postType": "NEWS",
                  "eventDate": "2026-08-25T18:00:00",
                  "startsAt": "2026-08-19T12:00:00",
                  "expiresAt": "2026-09-01T23:59:59",
                  "thumbnailUrl": "https://example.com/thumb.webp",
                  "imageUrls": [
                    "https://example.com/1.webp",
                    "https://example.com/2.webp"
                  ],
                  "externalLink": "https://example.com/more-info",
                  "translations": [
                    {
                      "translationId": 9,
                      "languageCode": "DE",
                      "title": "New event in KN Algo",
                      "shortDescription": "Short teaent.",
                      "fullDescription": "<b>Full, deta<b>re can be much more text.</b></b>"
                    },
                    {
                      "translationId": 8,
                      "languageCode": "EN",
                      "title": "New event in KN Algo",
                      "shortDescription": "Short teaser of our event.",
                      "fullDescription": "<b>Full, detailed description of our new blog post.</b> Here can be much more text."
                    },
                    {
                      "translationId": 7,
                      "languageCode": "PL",
                      "title": "Nowe wydarzenie w KN Algo",
                      "shortDescription": "Krótki zajawka naszego wydarzenia.",
                      "fullDescription": "<b>Pełny, szczegółowy opis naszego nowego wpisu na blogu.</b> Tutaj może być dużo więcej tekstu."
                    }
                  ]
                }
              ],
              "page": {
                "page": 0,
                "size": 20,
                "totalElements": 2,
                "totalPages": 1,
                "first": true,
                "last": true
              }
            }
            """;

    public static final String FILE_UPLOAD_200 = """
            {
              "url": "/img/20260917_134557_7003_5.jpeg"
            }
            """;

    public static final String FILE_UPLOAD_400 = """
            {
              "timestamp": "2026-09-17T13:44:28.3118316",
              "status": 400,
              "error": "Bad Request",
              "message": "Error: Invalid file type. Allowed: JPG, JPEG, PNG, WebP, GIF.",
              "path": "/api/files/upload",
              "validationErrors": null
            }
            """;

    public static final String FILE_BATCH_200 = """
            {
              "successes": [
                {
                  "url": "/img/20260917_134530_4e1b_1.jpeg",
                  "filename": "1.jpg"
                },
                {
                  "url": "/img/20260917_134530_6be2_2.jpeg",
                  "filename": "2.jpg"
                }
              ],
              "errors": [
                {
                  "error": "Error: Invalid file type. Allowed: JPG, JPEG, PNG, WebP, GIF.",
                  "filename": "index.html"
                }
              ]
            }
            """;

    public static final String CONTACT_400_VALIDATION = """
            {
              "timestamp": "2026-09-16T13:15:00.000+00:00",
              "status": 400,
              "error": "Bad Request",
              "message": "Validation failed for object='contactRequestDto'. Error count: 1",
              "errors": [
                {
                  "field": "replyTo",
                  "defaultMessage": "Invalid email address format"
                }
              ],
              "path": "/api/contact"
            }
            """;

    public static final String CONTACT_400_RECAPTCHA = """
            {
              "timestamp": "2026-09-16T13:16:00.000+00:00",
              "status": 400,
              "error": "Bad Request",
              "message": "ReCAPTCHA verification failed. Please try again..",
              "path": "/api/contact"
            }
            """;

    public static final String CONTACT_500 = """
            {
              "timestamp": "2026-09-17T13:54:25.6533237",
              "status": 500,
              "error": "Internal Server Error",
              "message": "Unexpected server error.",
              "path": "/api/contact",
              "validationErrors": null
            }
            """;
}