package br.org.otus.email.service;

import java.util.Map;

import javax.ejb.Asynchronous;
import javax.ejb.Local;
import javax.ejb.Stateless;
import javax.inject.Inject;

import br.org.otus.email.EmailSender;
import br.org.otus.email.StudioEmail;
import br.org.otus.email.WelcomeNotificationEmail;
import br.org.otus.email.dto.EmailSenderDto;
import br.org.otus.exceptions.DataNotFoundException;
import br.org.otus.exceptions.EmailNotificationException;
import br.org.otus.system.SystemConfigDao;
import br.org.owail.io.TemplateReader;
import br.org.owail.sender.email.Sender;
import br.org.owail.sender.gmail.GMailer;

@Stateless
@Local(EmailNotifierService.class)
public class EmailNotifierServiceBean implements EmailNotifierService {

	@Inject
	private SystemConfigDao systemConfigDao;

	@Override
	@Asynchronous
	public void sendEmail(StudioEmail email) throws EmailNotificationException, DataNotFoundException {
		GMailer mailer = GMailer.createTLSMailer();

		mailer.setFrom(email.getFrom());
		mailer.addRecipients(email.getRecipients());
		mailer.setSubject(email.getSubject());
		mailer.setContentType(email.getContentType());
		mailer.setContent(mergeTemplate(email.getContentDataMap(), email.getTemplatePath()));

		try {
			mailer.send();
		} catch (Exception e) {
			e.printStackTrace();
			throw new EmailNotificationException(e);
		}
	}

	@Override
	public Sender getSender() throws DataNotFoundException {
		EmailSender emailSender = systemConfigDao.findEmailSender();
		return new Sender(emailSender.getName(), emailSender.getEmailAddress(), emailSender.getPassword());
	}

	@Override
	public void sendWelcomeEmail(EmailSenderDto emailSenderDto)
			throws EmailNotificationException, DataNotFoundException {
		Sender sender = new Sender(emailSenderDto.getName(), emailSenderDto.getEmail(), emailSenderDto.getPassword());

		WelcomeNotificationEmail welcomeNotificationEmail = new WelcomeNotificationEmail();
		welcomeNotificationEmail.defineRecipient(emailSenderDto.getEmail());
		welcomeNotificationEmail.setFrom(sender);
		sendEmail(welcomeNotificationEmail);
	}

	private String mergeTemplate(Map<String, String> dataMap, String template) {
		TemplateReader templateReader = new TemplateReader();
		String templateContent = templateReader.getFileToString(getClass().getClassLoader(), template);
		return templateReader.fillTemplate(dataMap, templateContent);
	}

}
