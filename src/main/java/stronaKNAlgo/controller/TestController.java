package stronaKNAlgo.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("hello")
    public String sayHello() {
        return "Hello world";
    }

    @GetMapping("/home")
    public String home() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        return "Witaj! \n" +
                "Twój login: " + auth.getName() + "\n" +
                "Twoje uprawnienia (role): " + auth.getAuthorities();
    }

    @GetMapping("/")
    public String test() {
        return "Hello World";
    }

}