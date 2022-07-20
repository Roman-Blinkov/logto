import { ConnectorDto, ConnectorType } from '@logto/schemas';

import {
  deleteConnector,
  enableConnector,
  getConnectorDetails,
  listConnectors,
  updateConnectorConfig,
} from '@/connector-api';

const facebookConnectorId = 'facebook-universal';

// TODO: TEMP comment
// describe('list connectors and get details before setting up', () => {
//   it('should succeed to get all connectors and they are all disabled', async () => {
//     const response = await listConnectors();
//     expect(response).toHaveProperty('statusCode', 200);
//     expect(() => {
//       const connectorDtos = JSON.parse(response.body) as ConnectorDto[];
//       expect(
//         connectorDtos.every((connectorDto: ConnectorDto) => !connectorDto.enabled)
//       ).toBeTruthy();
//     }).not.toThrow();
//   });
//
//   it('should succeed to get connector details', async () => {
//     const response = await getConnectorDetails(facebookConnectorId);
//     expect(response).toHaveProperty('statusCode', 200);
//     expect(() => {
//       const connectorDto = JSON.parse(response.body) as ConnectorDto;
//       expect(connectorDto.enabled).toBeFalsy();
//     });
//   });
// });

describe('set up connectors', () => {
  describe('set up social connectors', () => {
    it('should succeed to update the social connector config and enable it', async () => {
      const config = {
        clientId: 'application_foo',
        clientSecret: 'secret_bar',
      };

      const updatedConfigResponse = await updateConnectorConfig(facebookConnectorId, config);
      expect(updatedConfigResponse).toHaveProperty('statusCode', 200);
      expect(() => {
        const updatedConnectorDto = JSON.parse(updatedConfigResponse.body) as ConnectorDto;
        expect(updatedConnectorDto.config).toEqual(config);
      }).not.toThrow();

      const enabledResponse = await enableConnector(facebookConnectorId);
      expect(enabledResponse).toHaveProperty('statusCode', 200);
      expect(() => {
        const enabledConnectorDto = JSON.parse(enabledResponse.body) as ConnectorDto;
        expect(enabledConnectorDto.enabled).toBeTruthy();
      }).not.toThrow();
    });
  });

  describe('set up sms connectors', () => {
    const aliyunSmsConnectorId = 'aliyun-short-message-service';
    const twilioSmsConnectorId = 'twilio-short-message-service';

    it('should succeed to update the first sms connector config and enable it', async () => {
      const config = {
        signName: '<sign-name>',
        templates: [
          {
            usageType: 'SignIn',
            templateCode: '<template-code>',
          },
          {
            usageType: 'Register',
            templateCode: '<template-code>',
          },
          {
            usageType: 'Test',
            templateCode: '<template-code>',
          },
        ],
        accessKeyId: '<access-key-id>',
        accessKeySecret: '<access-key-secret>',
      };

      const updatedConfigResponse = await updateConnectorConfig(aliyunSmsConnectorId, config);
      expect(updatedConfigResponse).toHaveProperty('statusCode', 200);
      expect(() => {
        const updatedConnectorDto = JSON.parse(updatedConfigResponse.body) as ConnectorDto;
        expect(updatedConnectorDto.config).toEqual(config);
      }).not.toThrow();

      const enabledResponse = await enableConnector(aliyunSmsConnectorId);
      expect(enabledResponse).toHaveProperty('statusCode', 200);
      expect(() => {
        const enabledConnectorDto = JSON.parse(enabledResponse.body) as ConnectorDto;
        expect(enabledConnectorDto.enabled).toBeTruthy();
      }).not.toThrow();
    });

    it('changing sms connector should succeed to update another sms connector config, enable it and auto-disable the original one', async () => {
      const config = {
        authToken: '<auth-token>',
        templates: [
          {
            content: 'This is for sign-in purposes only. Your passcode is {{code}}.',
            usageType: 'SignIn',
          },
          {
            content: 'This is for registering purposes only. Your passcode is {{code}}.',
            usageType: 'Register',
          },
          {
            content: 'This is for testing purposes only. Your passcode is {{code}}.',
            usageType: 'Test',
          },
        ],
        accountSID: '<account-sid>',
        fromMessagingServiceSID: '<from-messaging-service-sid>',
      };

      const updatedConfigResponse = await updateConnectorConfig(twilioSmsConnectorId, config);
      expect(updatedConfigResponse).toHaveProperty('statusCode', 200);
      expect(() => {
        const updatedConnectorDto = JSON.parse(updatedConfigResponse.body) as ConnectorDto;
        expect(updatedConnectorDto.config).toEqual(config);
      }).not.toThrow();

      const enabledResponse = await enableConnector(twilioSmsConnectorId);
      expect(enabledResponse).toHaveProperty('statusCode', 200);
      expect(() => {
        const enabledConnectorDto = JSON.parse(enabledResponse.body) as ConnectorDto;
        expect(enabledConnectorDto.enabled).toBeTruthy();
      }).not.toThrow();

      const response = await listConnectors();
      expect(response).toHaveProperty('statusCode', 200);
      expect(() => {
        const connectorDtos = JSON.parse(response.body) as ConnectorDto[];
        // There should be one and only one enabled sms connector after changing sms connector.
        expect(
          connectorDtos
            .filter((connector) => connector.type === ConnectorType.SMS)
            .every((connector) => connector.id === twilioSmsConnectorId || !connector.enabled)
        ).toBeTruthy();
      });
    });
  });

  describe('set up email connectors', () => {
    const aliyunEmailConnectorId = 'aliyun-direct-mail';
    const sendgridEmailConnectorId = 'sendgrid-email-service';

    it('should succeed to update the first email connector config and enable it', async () => {
      const config = {
        accessKeyId: '<your-access-key-id>',
        accessKeySecret: '<your-access-key-secret>',
        accountName: '<noreply@logto.io>',
        fromAlias: '<OPTIONAL-logto>',
        templates: [
          {
            subject: '<register-template-subject>',
            content: '<Logto: Your passcode is {{code}}. (regitser template)>',
            usageType: 'Register',
          },
          {
            subject: '<sign-in-template-subject>',
            content: '<Logto: Your passcode is {{code}}. (sign-in template)>',
            usageType: 'SignIn',
          },
          {
            subject: '<test-template-subject>',
            content: '<Logto: Your passcode is {{code}}. (test template)>',
            usageType: 'Test',
          },
        ],
      };

      const updatedConfigResponse = await updateConnectorConfig(aliyunEmailConnectorId, config);
      expect(updatedConfigResponse).toHaveProperty('statusCode', 200);
      expect(() => {
        const updatedConnectorDto = JSON.parse(updatedConfigResponse.body) as ConnectorDto;
        expect(updatedConnectorDto.config).toEqual(config);
      }).not.toThrow();

      const enabledResponse = await enableConnector(aliyunEmailConnectorId);
      expect(enabledResponse).toHaveProperty('statusCode', 200);
      expect(() => {
        const enabledConnectorDto = JSON.parse(enabledResponse.body) as ConnectorDto;
        expect(enabledConnectorDto.enabled).toBeTruthy();
      }).not.toThrow();
    });

    it('changing email connector should succeed to update another email connector config, enable it and auto-disable the original one', async () => {
      const config = {
        apiKey: '<api-key>',
        fromEmail: '<noreply@logto.test.io>',
        fromName: '<OPTIONAL-logto>',
        templates: [
          {
            usageType: 'SignIn',
            type: 'text/plain',
            subject: 'Logto SignIn Template',
            content: 'This is for sign-in purposes only. Your passcode is {{code}}.',
          },
          {
            usageType: 'Register',
            type: 'text/plain',
            subject: 'Logto Register Template',
            content: 'This is for registering purposes only. Your passcode is {{code}}.',
          },
          {
            usageType: 'Test',
            type: 'text/plain',
            subject: 'Logto Test Template',
            content: 'This is for testing purposes only. Your passcode is {{code}}.',
          },
        ],
      };

      const updatedConfigResponse = await updateConnectorConfig(sendgridEmailConnectorId, config);
      expect(updatedConfigResponse).toHaveProperty('statusCode', 200);
      expect(() => {
        const updatedConnectorDto = JSON.parse(updatedConfigResponse.body) as ConnectorDto;
        expect(updatedConnectorDto.config).toEqual(config);
      }).not.toThrow();

      const enabledResponse = await enableConnector(sendgridEmailConnectorId);
      expect(enabledResponse).toHaveProperty('statusCode', 200);
      expect(() => {
        const enabledConnectorDto = JSON.parse(enabledResponse.body) as ConnectorDto;
        expect(enabledConnectorDto.enabled).toBeTruthy();
      }).not.toThrow();

      const response = await listConnectors();
      expect(response).toHaveProperty('statusCode', 200);
      expect(() => {
        const connectorDtos = JSON.parse(response.body) as ConnectorDto[];
        // There should be one and only one enabled email connector after changing email connector.
        expect(
          connectorDtos
            .filter((connector) => connector.type === ConnectorType.Email)
            .every((connector) => connector.id === sendgridEmailConnectorId || !connector.enabled)
        ).toBeTruthy();
      });
    });
  });
});

describe('delete (i.e. disable) connectors', () => {
  it('should succeed to disable connector', async () => {
    const response = await getConnectorDetails(facebookConnectorId);
    expect(response).toHaveProperty('statusCode', 200);
    expect(() => {
      const connectorDto = JSON.parse(response.body) as ConnectorDto;
      expect(connectorDto.enabled).toBeTruthy();
    });

    const deletedResponse = await deleteConnector(facebookConnectorId);
    expect(deletedResponse).toHaveProperty('statusCode', 200);
    expect(() => {
      const connectorDto = JSON.parse(deletedResponse.body) as ConnectorDto;
      expect(connectorDto.enabled).toBeFalsy();
    });
  });
});

describe('send test sms/email passcode', () => {
  it('should succeed to send sms passcode', () => {
    // TODO twilioSmsConnectorId
  });

  it('should succeed to send email passcode', () => {
    // TODO sendgridEmailConnectorId
  });
});
