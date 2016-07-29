package br.org.otus.email;

import java.util.HashMap;
import java.util.Map;

import br.org.otus.user.User;
import br.org.owail.sender.email.Email;
import br.org.owail.sender.email.Mailer;

public class DisableUserNotificationEmail extends Email implements OtusEmail {

	private final String TEMPLATE = "/template/disable-user-notification-template.html";
	private final String SUBJECT = "Alerta - Cadastro desabilitado Otus";
	private Map<String, String> dataMap;

    public DisableUserNotificationEmail() {
        dataMap = new HashMap<>();
        defineSubject();
    }

    @Override
	public String getTemplatePath() {
		return TEMPLATE;
	}

	@Override
	public Map<String, String> getContentDataMap() {
		return dataMap;
	}

	@Override
	public String getContentType() {
		return Mailer.HTML;
	}

	public void defineRecipient(User user){
		addTORecipient("recipient", user.getEmail());
	}

    private void defineSubject(){
    	setSubject(SUBJECT);
    }

}
