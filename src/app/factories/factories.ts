import * as faker from 'faker';

import {Url} from '../services/url.service';
import {Contact} from '../services/url.service';
import {Globals} from '../app.config';

export class ContactFactory {
  static create(data?: object): Contact {
    return Contact.create(Object.assign({
      phone: faker.phone.phoneNumber(),
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.stateAbbr(),
      zip: faker.address.zipCode(),
      name: faker.company.companyName(0),
    }, data));
  }
}

export class UrlFactory {
  static create(data?: object): Url {

    const lookForRange = [
      faker.random.number({min: 0, max: Globals.lookForFilters.length}),
      faker.random.number({min: 0, max: Globals.lookForFilters.length})
    ];

    const contextTypeRange = [
      faker.random.number({min: 0, max: Globals.contentTypeFilters.length}),
      faker.random.number({min: 0, max: Globals.contentTypeFilters.length})
    ];

    const excludeRange = [
      faker.random.number({min: 0, max: Globals.excludeFilters.length}),
      faker.random.number({min: 0, max: Globals.excludeFilters.length})
    ];

    return Url.create(Object.assign({
      // id: faker.random.number(),
      url: faker.internet.url(),
      // status: faker.random.arrayElement([
      //   'not_started',
      //   'in_progress',
      //   'completed',
      //   'error',
      //   'warning'
      // ]),
      status: 'not_started',
      lookForFilter: Globals.lookForFilters.slice(Math.min(... lookForRange), Math.max(... lookForRange)),
      contentTypeFilter: Globals.contentTypeFilters.slice(Math.min(... contextTypeRange), Math.max(... contextTypeRange)),
      excludeFilter: Globals.excludeFilters.slice(Math.min(... excludeRange), Math.max(... excludeRange)),
    }, data));
  }
}
