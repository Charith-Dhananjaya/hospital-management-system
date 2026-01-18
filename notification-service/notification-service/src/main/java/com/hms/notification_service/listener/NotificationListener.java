package com.hms.notification_service.listener;

import com.hms.notification_service.event.AppointmentBookedEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationListener {

    @RabbitListener(queues = "notification.queue")
    public void handleNotification(AppointmentBookedEvent event) {
        // This method triggers AUTOMATICALLY when a message arrives

        System.out.println("=========================================");
        System.out.println("📧 RECEIVED NEW NOTIFICATION!");
        System.out.println("To: " + event.getPatientEmail());
        System.out.println("Body: " + event.getMessage());
        System.out.println("Appointment ID: " + event.getAppointmentId());
        System.out.println("=========================================");

        // In the future, we will put real Email sending code here!
    }
}