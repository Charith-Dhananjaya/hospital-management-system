package com.hms.notification_service.listener;

import com.hms.notification_service.event.AppointmentBookedEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationListener {

    @Autowired
    private JavaMailSender mailSender;

    @RabbitListener(queues = "notification.queue")
    public void handleNotification(AppointmentBookedEvent event) {

        System.out.println("📨 Handling Notification for: " + event.getPatientEmail());

        try {
            // 1. Create the Email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(event.getPatientEmail()); // The Real Patient Email
            message.setSubject("HMS Appointment Confirmation");
            message.setText(event.getMessage());
            message.setFrom("your_email@gmail.com");

            // 2. Send It!
            mailSender.send(message);

            System.out.println("✅ Email sent successfully to " + event.getPatientEmail());

        } catch (Exception e) {
            System.out.println("❌ Failed to send email: " + e.getMessage());
        }
    }
}