package security;

import org.jasypt.encryption.pbe.PBEStringEncryptor;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.inject.Named;

public class EncryptProvider {


    /**
     * @return Возвращает объект для шифрования.
     */
    @Produces
    @ApplicationScoped
    @Named(AuthorizationServiceImpl.ENCRYPT_NAME)
    public PBEStringEncryptor getPBEStringEncrypter() {

        // Настройка шифратора для аутентификационных данных.
        final StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
        encryptor.setAlgorithm("PBEWITHSHA1ANDDESEDE");
        // http://www.jasypt.org/advancedconfiguration.html
            final SimpleStringPBEConfig pbeConfig = new SimpleStringPBEConfig();
            pbeConfig.setPassword("mAyhVEIkvM");
            encryptor.setConfig(pbeConfig);

        return encryptor;
    }
}
