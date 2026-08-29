package algo.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service handling the construction and transmission of email messages.
 */
@Service
public class EmailService {

    /** The Spring Mail sender used to transmit emails. */
    private final JavaMailSender mailSender;

    /**
     * Constructs the service with the required JavaMailSender.
     *
     * @param mailSender the mail sender used to transmit emails.
     */
    public EmailService(final JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends a contact email to the organization's mailbox.
     *
     * @param senderName the name of the person sending the message.
     * @param replyTo    the email address of the sender.
     * @param content    the body of the message.
     */
    public void sendContactEmail(final String senderName, final String replyTo, final String content) {
        final SimpleMailMessage message = new SimpleMailMessage();

        message.setTo("ourEmail@gmail.com");

        message.setReplyTo(replyTo);

        message.setSubject("Nowa wiadomość z formularza kontaktowego od: " + senderName);

        final String formattedBody = """
                Otrzymano nową wiadomość ze strony internetowej.
                
                Nadawca: %s
                Email zwrotny: %s
                
                Treść wiadomości:
                %s
                """.formatted(senderName, replyTo, content);

        message.setText(formattedBody);

        mailSender.send(message);
    }
}